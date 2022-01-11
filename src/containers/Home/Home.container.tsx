import Button from '@/components/Button/Button.component'
import { Page } from '@/components/Page/Page.component'
import { Post } from '@/components/Post/Post.component'
import {
  SkeletonView,
  SkeletonViewTemplates,
} from '@/components/SkeletonView/SkeletonView.component'
import { LIKE_POST, UNLIKE_POST } from '@/graphql/mutations/LikePost.mutation'
import {
  FETCH_POSTS,
  IFetchPostsVariables,
} from '@/graphql/queries/FetchPosts.query'
import { Routes } from '@/navigators/navigator.props'
import { navigate } from '@/navigators/utils/navigation'
import { useAppSelector } from '@/store'
import {
  setPosts,
  updatePostLiked,
  updatePostUnLiked,
} from '@/store/reducers/post.reducer'
import { logout } from '@/store/reducers/user.reducer'
import { ERROR_CODES, ERROR_CODES_RAW } from '@/types/error_codes'
import { IPost, IUserlike } from '@/types/post.types'
import { handleApolloErrors } from '@/utils/apollo'
import { showToast, ToastStatus } from '@/utils/toast'
import { useMutation, useQuery } from '@apollo/client'
import React, { useCallback } from 'react'
import { FlatList, RefreshControl } from 'react-native'
import Text from 'react-native-ui-lib/text'
import { useDispatch } from 'react-redux'

const HomeContainer = () => {
  const posts = useAppSelector(state => state.postReducer.posts)
  const dispatch = useDispatch()
  const fetchPosts = useQuery<{ posts: IPost[] }, IFetchPostsVariables>(
    FETCH_POSTS,
    {
      variables: {
        offset: 0,
        limit: 15,
      },
      onCompleted: data => dispatch(setPosts(data.posts)),
    },
  )

  const [likePost] = useMutation<{ likeEntry: IUserlike }, { postId: number }>(
    LIKE_POST,
    {
      onCompleted: () => {
        showToast(ToastStatus.Success, 'Beğendiniz!')
      },
      onError: err => {
        const errorCode = handleApolloErrors(err, ERROR_CODES_RAW.ALREADY_LIKED)

        if (errorCode) {
          showToast(ToastStatus.Error, ERROR_CODES[errorCode])
        }
      },
    },
  )

  const [unlikePost] = useMutation<
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

  const fetchMorePosts = useCallback(() => {
    if (posts.length < 15) {
      return
    }

    fetchPosts
      .fetchMore({
        variables: {
          offset: posts.length + 15,
        },
      })
      .then(data => dispatch(setPosts([...posts, ...data.data?.posts])))
  }, [fetchPosts, posts, dispatch])

  function renderItem({ item }: { item: IPost }) {
    return (
      <Post
        title={item.title}
        commentsCount={item._count.comment}
        date={item.created_at}
        likesCount={item.postLike.likeCount}
        onPressPost={() => {
          navigate(Routes.PostDetails, { postId: item.id })
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
      />
    )
  }
  const getItemLayout = (data: any, index: any) => ({
    length: 50,
    offset: 70 * index,
    index,
  })

  const refreshControl = useCallback(() => {
    return (
      <RefreshControl
        refreshing={fetchPosts.loading}
        onRefresh={fetchPosts.refetch}
      />
    )
  }, [fetchPosts])

  function renderContent() {
    return (
      <FlatList
        data={posts}
        renderItem={renderItem}
        maxToRenderPerBatch={10}
        ListHeaderComponent={
          <Text title textColor>
            🚀 Öne çıkanlar
          </Text>
        }
        onEndReached={fetchMorePosts}
        onEndReachedThreshold={0.5}
        getItemLayout={getItemLayout}
        removeClippedSubviews
        refreshControl={refreshControl()}
      />
    )
  }

  return (
    <Page>
      <SkeletonView
        showContent={!fetchPosts.loading}
        template={SkeletonViewTemplates.LIST_ITEM}
        renderContent={renderContent}
        times={8}
      />
      <Button onPress={() => dispatch(logout())} label="qwelqwekl" />
    </Page>
  )
}

export default HomeContainer
