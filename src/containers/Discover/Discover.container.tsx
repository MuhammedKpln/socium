import { Page } from '@/components/Page/Page.component'
import {
  FETCH_ALL_DISCOVER_POSTS,
  IFetchallDiscoverPostsResponse,
  IFetchallDiscoverPostsVariables,
} from '@/graphql/queries/FetchAllDisoverPosts.query'
import { IUseLikesEntity, useLikes } from '@/hooks/useLikes'
import { usePagination } from '@/hooks/usePagination'
import { Routes } from '@/navigators/navigator.props'
import { navigate } from '@/navigators/utils/navigation'
import { IPost, PostType } from '@/types/post.types'
import { useQuery } from '@apollo/client'
import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useEffect, useLayoutEffect } from 'react'
import { FlatList, RefreshControl } from 'react-native'
import View from 'react-native-ui-lib/view'
import { Categories } from './components/Categories.component'
import { DiscoverPost } from './components/DiscoverPost.component'
import { YoutubePost } from './components/YoutubePost.component'

export function DiscoverContainer() {
  const navigation = useNavigation()
  const { toggleLikeButton } = useLikes()
  const { data, fetchMore, refetch, loading } =
    useQuery<IFetchallDiscoverPostsResponse>(FETCH_ALL_DISCOVER_POSTS, {})
  const { fetchMoreData } = usePagination<
    IFetchallDiscoverPostsVariables,
    IFetchallDiscoverPostsResponse
  >({
    fetchMore,
  })

  useEffect(() => {
    console.log('data changed')
  }, [data])

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '🔥 Keşfet',
    })
  }, [navigation])

  const onPressLike = useCallback(
    async (post: IPost) => {
      await toggleLikeButton({
        entityId: post.id,
        entityType: IUseLikesEntity.POST,
        isLiked: post.userLike?.liked,
        update: (cache, result) => {
          const query: IFetchallDiscoverPostsResponse | null = cache.readQuery({
            query: FETCH_ALL_DISCOVER_POSTS,
          })

          if (!query || !result.data?.likeEntry) {
            return
          }

          const newPosts = query.postsWithoutBlog
          const index = newPosts.findIndex(p => p.id === post.id)

          if (!post.userLike.liked) {
            newPosts[index].userLike = result.data?.likeEntry
            newPosts[index].postLike.likeCount =
              newPosts[index].postLike.likeCount + 1
          } else {
            newPosts[index].userLike.liked = false
            newPosts[index].postLike.likeCount =
              newPosts[index].postLike.likeCount - 1
          }

          cache.modify({
            fields: {
              postsWithoutBlog() {
                return newPosts
              },
            },
            broadcast: true,
          })
        },
      })
    },
    [toggleLikeButton],
  )

  const renderItem = useCallback(
    ({ item }: { item: IPost }) => {
      return (
        <View marginV-20>
          {item.type === PostType.Youtube ? (
            <YoutubePost
              post={item}
              user={item.user}
              onPressLike={() => onPressLike(item)}
              onPressComment={() =>
                navigate(Routes.PostDetails, {
                  postId: item.id,
                })
              }
              onPressSave={() => null}
              key={item.id}
              isLiked={item.userLike?.liked}
            />
          ) : (
            <DiscoverPost
              post={item}
              user={item.user}
              onPressLike={() => onPressLike(item)}
              onPressComment={() =>
                navigate(Routes.PostDetails, {
                  postId: item.id,
                })
              }
              onPressSave={() => null}
              key={item.id}
              isLiked={item.userLike?.liked}
            />
          )}
        </View>
      )
    },
    [onPressLike],
  )

  const fetchMorePosts = useCallback(() => {
    console.warn(data?.postsWithoutBlog?.length)
    if (data?.postsWithoutBlog?.length) {
      fetchMoreData({
        offset: data.postsWithoutBlog.length,
        additionalVariables: {},
      })
    }
  }, [fetchMoreData, data])

  const refreshControl = useCallback(() => {
    return <RefreshControl refreshing={loading} onRefresh={refetch} />
  }, [loading, refetch])

  return (
    <Page>
      <View marginB-10>
        <Categories />
      </View>
      <FlatList
        renderItem={renderItem}
        data={data?.postsWithoutBlog}
        contentContainerStyle={{ padding: 10 }}
        onEndReached={fetchMorePosts}
        onEndReachedThreshold={0.5}
        removeClippedSubviews
        refreshControl={refreshControl()}
      />
    </Page>
  )
}
