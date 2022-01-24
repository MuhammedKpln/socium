import { Avatar } from '@/components/Avatar/Avatar.component'
import { Icon } from '@/components/Icon/Icon.component'
import { InstagramPost } from '@/components/InstagramPost/InstagramPost.component'
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
import { INavigatorParamsList, Routes } from '@/navigators/navigator.props'
import { PostType } from '@/types/post.types'
import { IInstagramMeta } from '@/types/socialMedia.types'
import { useQuery } from '@apollo/client'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import Text from 'react-native-ui-lib/text'
import View from 'react-native-ui-lib/view'
import { PostComments } from './components/Comments.component'
import { PostTypeWrapper } from './components/PostTypeWrapper.component'

export function PostDetails() {
  const navigation = useNavigation()
  const { toggleLikeButton } = useLikes()
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
      headerRight: () => <Icon name="bookmark" size={20} />,
    })
  })

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
      <Page width="100%">
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
                {renderYoutubeIframe(post.additional ? post.additional : '')}
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

          <Text>{post.content}</Text>
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

        <View marginT-10>
          <PostComments postId={post.id} />
        </View>
      </Page>
    )
  }

  return (
    <SkeletonView
      renderContent={renderContent}
      showContent={!_post.loading}
      template={SkeletonViewTemplates.TEXT_CONTENT}
    />
  )
}
