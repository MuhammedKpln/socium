import { Avatar } from '@/components/Avatar/Avatar.component'
import { Icon } from '@/components/Icon/Icon.component'
import { InstagramPost } from '@/components/InstagramPost/InstagramPost.component'
import { KeyboardAvoidingView } from '@/components/KeyboardAvoidingView/KeyboardAvoidingView.component'
import { Page } from '@/components/Page/Page.component'
import { PostActions } from '@/components/Post/PostActions.component'
import {
  SkeletonView,
  SkeletonViewTemplates,
} from '@/components/SkeletonView/SkeletonView.component'
import { TwitterPost } from '@/components/TwitterPost/TwitterPost.component'
import {
  FETCH_POST,
  IFetchPostResponse,
  IFetchPostVariables,
} from '@/graphql/queries/FetchPost.query'
import { IUseLikesEntity, IUseLikesProps, useLikes } from '@/hooks/useLikes'
import type { INavigatorParamsList, Routes } from '@/navigators/navigator.props'
import { useAppSelector } from '@/store'
import { updateAnsweringParent } from '@/store/reducers/comment.reducer'
import { PostType } from '@/types/post.types'
import type { IInstagramMeta } from '@/types/socialMedia.types'
import { showToast, ToastStatus } from '@/utils/toast'
import { useQuery } from '@apollo/client'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { Platform } from 'react-native'
import { Keyboard, ScrollView } from 'react-native'
import Text from 'react-native-ui-lib/text'
import View from 'react-native-ui-lib/view'
import { useDispatch } from 'react-redux'
import { PostComments } from './components/Comments.component'
import { NewComment } from './components/NewComment.component'
import { PostTypeWrapper } from './components/PostTypeWrapper.component'

export function PostDetails() {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const scrollViewRef = useRef<ScrollView>()
  const { toggleLikeButton } = useLikes()
  const isAnsweringParent = useAppSelector(
    state => state.commentReducer.isAnsweringParent,
  )

  const [instagramMeta, setInstagramMeta] = useState<
    IInstagramMeta | undefined
  >()
  const route = useRoute<RouteProp<INavigatorParamsList, Routes.PostDetails>>()
  const _post = useQuery<IFetchPostResponse, IFetchPostVariables>(FETCH_POST, {
    variables: {
      id: route.params.postId,
    },

    onCompleted: async data => {
      if (data.post.type === PostType.Instagram) {
        await fetchInstagramPost()
      }
    },
  })
  const post = _post.data?.post

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Icon
          name="bookmark"
          size={20}
          onPress={() =>
            showToast(ToastStatus.Success, 'Gönderi favorilere eklendi!')
          }
        />
      ),
    })
  })

  useEffect(() => {
    Keyboard.addListener('keyboardWillShow', () => {
      scrollViewRef.current?.scrollToEnd({ animated: true })
    })

    return () => {
      dispatch(updateAnsweringParent(null))
      Keyboard.removeAllListeners('keyboardWillShow')
    }
  }, [dispatch])

  const fetchInstagramPost = useCallback(async () => {
    const response = await fetch(
      `https://api.instagram.com/oembed/?url=${post?.additional}`,
    )
    const responseJson = await response.json()
    setInstagramMeta(responseJson)
  }, [post?.additional])

  const onPressLike = useCallback(
    async (props: IUseLikesProps) => {
      const { result } = await toggleLikeButton(props)

      const data = _post.client.cache.readQuery<IFetchPostResponse>({
        query: FETCH_POST,
        variables: {
          id: post?.id,
        },
      })

      let postLike: any
      let userLike: any

      postLike = {
        ...data?.post.postLike,
        ...result,
      }
      userLike = result.userLike

      if (data) {
        _post.client.cache.writeQuery({
          query: FETCH_POST,
          variables: {
            id: post?.id,
          },
          data: {
            post: {
              ...data.post,
              postLike: postLike,
              userLike: userLike,
            },
          },
        })
      }
    },
    [toggleLikeButton, post?.id, _post.client.cache],
  )

  const renderYoutubeIframe = (additional: string) => {
    const YoutubePlayer =
      require('@/components/YoutubePlayer/YoutubePlayer.component').YTPlayer
    let videoId: string = ''

    if (additional.includes('youtu.be')) {
      videoId = additional.split('https://youtu.be/')[1]
    }
    if (additional.includes('watch?v=')) {
      videoId = additional.split('watch?v=')[1]
    }

    return <YoutubePlayer videoId={videoId} />
  }

  function renderContent() {
    if (!post) return

    return (
      <Page>
        <KeyboardAvoidingView
          keyboardVerticalOffset={Platform.select({ ios: 115, android: 100 })}
        >
          <ScrollView
            ref={scrollViewRef}
            style={{ height: !isAnsweringParent ? '90%' : '70%' }}
          >
            <View>
              <View row>
                <Avatar userAvatar={post?.user?.avatar} />
                <View marginL-5>
                  <Text textColor text text90BL>
                    {post?.user.username}
                  </Text>
                  <Text text greyText>
                    @{post?.user.username}
                  </Text>
                </View>
              </View>

              <View marginV-10>
                {post?.type === PostType.Instagram && instagramMeta ? (
                  <PostTypeWrapper postType={post.type}>
                    <View>
                      <InstagramPost
                        authorName={instagramMeta?.author_name}
                        thumbnailUrl={instagramMeta?.thumbnail_url}
                        title={instagramMeta?.title}
                      />
                    </View>
                  </PostTypeWrapper>
                ) : null}
                {post?.type === PostType.Youtube ? (
                  <PostTypeWrapper postType={post.type}>
                    <View>
                      {renderYoutubeIframe(
                        post.additional ? post.additional : '',
                      )}
                    </View>
                  </PostTypeWrapper>
                ) : null}
                {post?.type === PostType.Twitter ? (
                  <PostTypeWrapper postType={post.type}>
                    <View>
                      <TwitterPost
                        twitterUrl={post.additional ? post.additional : ''}
                      />
                    </View>
                  </PostTypeWrapper>
                ) : null}

                <Text marginT-10>{post.content}</Text>
              </View>
              <View marginR-30>
                <PostActions
                  commentsCount={post?._count?.comment.toString()}
                  likesCount={post?.postLike?.likeCount.toString()}
                  isLiked={post?.userLike?.liked ?? false}
                  onPressComment={() => null}
                  onPressLike={() =>
                    onPressLike({
                      entityId: post?.id,
                      entityType: IUseLikesEntity.POST,
                      isLiked: post?.userLike?.liked ?? false,
                    })
                  }
                  onPressSave={() => null}
                  showDate
                  date={post.created_at}
                />
              </View>
            </View>

            <View marginT-10>
              <PostComments postId={post.id} />
            </View>
          </ScrollView>
          <View marginT-10>
            <NewComment
              postId={post.id}
              parentId={isAnsweringParent ?? undefined}
            />
          </View>
        </KeyboardAvoidingView>
      </Page>
    )
  }

  if (_post.loading) {
    return (
      <Page>
        <View row>
          <SkeletonView circle width={50} height={50} />
          <View marginL-10>
            <SkeletonView width={100} height={15} />
            <SkeletonView width={100} height={10} style={{ marginTop: 15 }} />
          </View>
        </View>
        <View marginT-30>
          <SkeletonView template={SkeletonViewTemplates.TEXT_CONTENT} />
        </View>
      </Page>
    )
  }

  return renderContent()
}
