import { Avatar } from '@/components/Avatar/Avatar.component'
import { Icon } from '@/components/Icon/Icon.component'
import { MarkdownRenderer } from '@/components/MarkdownRenderer/MarkdownRenderer.component'
import { Page } from '@/components/Page/Page.component'
import { PostActions } from '@/components/Post/PostActions.component'
import {
  SkeletonView,
  SkeletonViewTemplates,
} from '@/components/SkeletonView/SkeletonView.component'
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
import Image from 'react-native-ui-lib/image'
import Text from 'react-native-ui-lib/text'
import View from 'react-native-ui-lib/view'
import { PostComments } from './components/Comments.component'

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
      `https://api.instagram.com/oembed/?url=${post?.content}`,
    )
    const responseJson = await response.json()
    setInstagramMeta(responseJson)
  }, [post?.content])

  const onPressLike = useCallback(
    async (props: IUseLikesProps) => {
      await toggleLikeButton(props)

      _post.client.cache.modify({
        fields: {
          post: (s, {}) => {
            console.log(s)
          },
        },
      })
    },
    [_post, toggleLikeButton],
  )

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
          {post?.type !== PostType.Instagram ? <></> : null}
          {post?.type == PostType.Content ? (
            <MarkdownRenderer>{post?.content}</MarkdownRenderer>
          ) : null}

          {post?.type === PostType.Instagram ? (
            <Image
              source={{ uri: instagramMeta?.thumbnail_url }}
              height={238}
              borderRadius={16}
              marginT-20
            />
          ) : null}
        </View>
        <View marginR-30>
          <PostActions
            commentsCount={post?._count?.comment.toString()}
            likesCount={post?.postLike?.likeCount.toString()}
            isLiked={post?.userLike?.liked}
            onPressComment={() => null}
            onPressLike={() =>
              onPressLike({
                entityId: post?.id,
                entityType: IUseLikesEntity.POST,
                isLiked: post?.userLike?.liked,
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
