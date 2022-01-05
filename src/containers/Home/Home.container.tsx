import { Page } from '@/components/Page/Page.component'
import { Post } from '@/components/Post/Post.component'
import { LIKE_POST, UNLIKE_POST } from '@/graphql/mutations/LikePost.mutation'
import { FETCH_POSTS } from '@/graphql/queries/FetchPosts.query'
import { Routes } from '@/navigators/navigator.props'
import { navigate } from '@/navigators/utils/navigation'
import { useAppSelector } from '@/store'
import {
  setPosts,
  updatePostLiked,
  updatePostUnLiked,
} from '@/store/reducers/post.reducer'
import { ERROR_CODES, ERROR_CODES_RAW } from '@/types/error_codes'
import { IPost, IUserlike } from '@/Types/post.types'
import { handleApolloErrors } from '@/utils/apollo'
import { showToast, ToastStatus } from '@/utils/toast'
import { useMutation, useQuery } from '@apollo/client'
import React from 'react'
import { FlatList } from 'react-native'
import SkeletonView from 'react-native-ui-lib/skeletonView'
import Text from 'react-native-ui-lib/text'
import { useDispatch } from 'react-redux'

const HomeContainer = () => {
  const posts = useAppSelector(state => state.postReducer.posts)
  const dispatch = useDispatch()
  const fetchPosts = useQuery<{ posts: IPost[] }>(FETCH_POSTS, {
    onCompleted: data => dispatch(setPosts(data.posts)),
  })

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

  const [unlikePost, unlikePostMeta] = useMutation<
    { likeEntry: IUserlike },
    { postId: number }
  >(UNLIKE_POST, {
    onCompleted: () => {
      showToast(ToastStatus.Success, 'Beğendiniyi geri çektiniz!')
    },
  })

  const toggleLikeButton = async (
    isLiked: boolean,
    id: { likeId?: number; postId: number },
  ) => {
    const postIndex = posts.findIndex(e => e.id === id.postId)
    const currentPost = posts[postIndex]

    if (isLiked) {
      await unlikePost({
        variables: {
          postId: id.postId,
        },
      })

      dispatch(
        updatePostUnLiked({
          post: currentPost,
        }),
      )

      return
    }

    await likePost({
      variables: {
        postId: id.postId,
      },
    })

    dispatch(
      updatePostLiked({
        post: currentPost,
      }),
    )
  }

  function onPressSave() {
    showToast(ToastStatus.Success, 'Kaydedilenlerinize ekleni.')
  }

  function renderItem({ item }: { item: IPost }) {
    return (
      <Post
        title={item.title}
        commentsCount={item._count.comment}
        date={item.created_at}
        likesCount={item.postLike.likeCount}
        onPressPost={() => {
          navigate(Routes.Login, { postId: item.id })
        }}
        postType={item.type}
        isLiked={item.userLike?.liked}
        key={item.slug}
        user={item.user}
        onPressRemove={() => null}
        content={item.content}
        onPressComment={() => null}
        onPressSave={onPressSave}
        onPressLike={() =>
          toggleLikeButton(item.userLike?.liked, {
            postId: item.id,
            likeId: item.userLike?.id,
          })
        }
        loading={likePostMeta.loading || unlikePostMeta.loading}
      />
    )
  }

  function renderContent() {
    return (
      <FlatList
        data={posts}
        renderItem={renderItem}
        ListHeaderComponent={<Text title>🚀 Öne çıkanlar</Text>}
      />
    )
  }

  return (
    <Page>
      <SkeletonView
        showContent={!fetchPosts.loading}
        template={SkeletonView.templates.LIST_ITEM}
        renderContent={renderContent}
        times={8}
      />
    </Page>
  )
}

export default HomeContainer
