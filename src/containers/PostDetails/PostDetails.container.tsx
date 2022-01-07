import { Avatar } from '@/components/Avatar/Avatar.component'
import { Icon } from '@/components/Icon/Icon.component'
import { MarkdownRenderer } from '@/components/MarkdownRenderer/MarkdownRenderer.component'
import { Page } from '@/components/Page/Page.component'
import { PostActions } from '@/components/Post/PostActions.component'
import {
  SkeletonView,
  SkeletonViewTemplates,
} from '@/components/SkeletonView/SkeletonView.component'
import { LIKE_POST, UNLIKE_POST } from '@/graphql/mutations/LikePost.mutation'
import {
  FETCH_POST,
  IFetchPostResponse,
  IFetchPostVariables,
} from '@/graphql/queries/FetchPost.query'
import { INavigatorParamsList, Routes } from '@/navigators/navigator.props'
import {
  updatePostLiked,
  updatePostUnLiked,
} from '@/store/reducers/post.reducer'
import { ERROR_CODES, ERROR_CODES_RAW } from '@/types/error_codes'
import { IUserlike, PostType } from '@/types/post.types'
import { IInstagramMeta } from '@/types/socialMedia.types'
import { handleApolloErrors } from '@/utils/apollo'
import { showToast, ToastStatus } from '@/utils/toast'
import { useMutation, useQuery } from '@apollo/client'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import * as dayjs from 'dayjs'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import Image from 'react-native-ui-lib/image'
import Text from 'react-native-ui-lib/text'
import View from 'react-native-ui-lib/view'
import { useDispatch } from 'react-redux'
import { PostComments } from './components/Comments.component'

var customParseFormat = require('dayjs/plugin/customParseFormat')
var relativeTime = require('dayjs/plugin/relativeTime')

dayjs.locale('tr')
dayjs.extend(customParseFormat)
dayjs.extend(relativeTime)

export function PostDetails() {
  const navigation = useNavigation()
  const dispatch = useDispatch()
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

  const [likePost, likePostMeta] = useMutation<
    { likeEntry: IUserlike },
    { postId: number }
  >(LIKE_POST, {
    onCompleted: () => {
      showToast(ToastStatus.Success, 'Beğendiniz!')
    },
    onError: err => {
      const errorCode = handleApolloErrors(err, ERROR_CODES_RAW.ALREADY_LIKED)

      if (errorCode) {
        showToast(ToastStatus.Error, ERROR_CODES[errorCode])
      }
    },
  })

  const toggleLikeButton = async () => {
    if (post && post?.userLike?.liked) {
      await unlikePost({
        variables: {
          postId: post.id,
        },
      })

      dispatch(
        updatePostUnLiked({
          post,
        }),
      )

      return
    }

    if (post) {
      await likePost({
        variables: {
          postId: post.id,
        },
      })
      dispatch(
        updatePostLiked({
          post,
        }),
      )
    }
  }

  const [unlikePost, unlikePostMeta] = useMutation<
    { likeEntry: IUserlike },
    { postId: number }
  >(UNLIKE_POST, {
    onCompleted: () => {
      showToast(ToastStatus.Success, 'Beğendiniyi geri çektiniz!')
    },
  })

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
        <View marginH-5>
          <PostActions
            commentsCount={post?._count?.comment.toString()}
            likesCount={post?.postLike?.likeCount.toString()}
            isLiked={post?.userLike?.liked}
            loading={likePostMeta.loading || unlikePostMeta.loading}
            onPressComment={() => null}
            onPressLike={toggleLikeButton}
            onPressSave={() => null}
            showDate
            // @ts-ignore
            date={dayjs.default(post.created_at).fromNow()}
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
