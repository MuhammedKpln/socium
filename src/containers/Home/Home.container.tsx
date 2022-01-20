import { Page } from '@/components/Page/Page.component'
import { Post } from '@/components/Post/Post.component'
import {
  SkeletonView,
  SkeletonViewTemplates,
} from '@/components/SkeletonView/SkeletonView.component'
import {
  FETCH_POSTS,
  IFetchPostsResponse,
  IFetchPostsVariables,
} from '@/graphql/queries/FetchPosts.query'
import { IUseLikesEntity, IUseLikesProps, useLikes } from '@/hooks/useLikes'
import { Routes } from '@/navigators/navigator.props'
import { navigate } from '@/navigators/utils/navigation'
import { useAppSelector } from '@/store'
import { setPosts } from '@/store/reducers/post.reducer'
import { IPost } from '@/types/post.types'
import { showToast, ToastStatus } from '@/utils/toast'
import { ApolloCache, useQuery } from '@apollo/client'
import React, { useCallback, useEffect } from 'react'
import { FlatList, RefreshControl } from 'react-native'
import Text from 'react-native-ui-lib/text'
import { useDispatch } from 'react-redux'

const HomeContainer = () => {
  const posts = useAppSelector(state => state.postReducer.posts)
  const dispatch = useDispatch()
  const { toggleLikeButton } = useLikes()
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

  const likePost = useCallback(
    async (props: IUseLikesProps) => {
      await toggleLikeButton(props)
    },
    [toggleLikeButton],
  )

  const updateLikedCache = useCallback(
    (cache: ApolloCache<any>, result, item: IPost) => {
      const prevResults: IFetchPostsResponse | null = cache.readQuery({
        query: FETCH_POSTS,
      })

      if (prevResults) {
        const index = prevResults.posts.findIndex(v => v.id === item.id)

        if (item.userLike?.liked) {
          prevResults.posts[index].userLike.liked = false
        } else {
          if (!result.data?.likeEntry) {
            return null
          }

          prevResults.posts[index].userLike = result.data.likeEntry
        }

        cache.modify({
          fields: {
            posts() {
              return prevResults.posts
            },
          },
          broadcast: true,
        })
      }
    },
    [],
  )

  function onPressSave() {
    showToast(ToastStatus.Success, 'Kaydedilenlerinize ekleni.')
  }

  const fetchMorePosts = useCallback(() => {
    if (posts.length < 15) {
      return
    }

    fetchPosts.fetchMore({
      variables: {
        offset: posts.length,
      },
    })
  }, [fetchPosts, posts])

  useEffect(() => {
    console.log('IM CHANGED WALLAHSS')
  }, [fetchPosts])

  function renderItem({ item }: { item: IPost }) {
    return (
      <Post
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
          likePost({
            entityId: item.id,
            entityType: IUseLikesEntity.POST,
            isLiked: item.userLike?.liked,
            update: (cache, result) => updateLikedCache(cache, result, item),
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
        data={fetchPosts.data?.posts}
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
      {/* <Button onPress={() => dispatch(logout())} label="qwelqwekl" /> */}
    </Page>
  )
}

export default HomeContainer
