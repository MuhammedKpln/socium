import { Page } from '@/components/Page/Page.component'
import {
  FOLLOW_USER,
  IFollowArgs,
  IFollowUserResponse,
  IUnFollowUserResponse,
  UNFOLLOW_USER,
} from '@/graphql/mutations/Follower.mutation'
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
import { useMutation, useQuery } from '@apollo/client'
import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useEffect, useLayoutEffect } from 'react'
import { RefreshControl } from 'react-native'
import BigList from 'react-native-big-list'
import View from 'react-native-ui-lib/view'
import { Categories } from './components/Categories.component'
import { DiscoverPost } from './components/DiscoverPost.component'
import { InstagramPost } from './components/InstagramPost.componen'
import { TwitterPost } from './components/TwitterPost.component'
import { YoutubePost } from './components/YoutubePost.component'

export function DiscoverContainer() {
  const navigation = useNavigation()
  const { toggleLikeButton } = useLikes()
  const { data, fetchMore, refetch, loading, client } =
    useQuery<IFetchallDiscoverPostsResponse>(FETCH_ALL_DISCOVER_POSTS, {})
  const { fetchMoreData } = usePagination<
    IFetchallDiscoverPostsVariables,
    IFetchallDiscoverPostsResponse
  >({
    fetchMore,
  })
  const [followUser] = useMutation<IFollowUserResponse, IFollowArgs>(
    FOLLOW_USER,
  )
  const [unfollowUser] = useMutation<IUnFollowUserResponse, IFollowArgs>(
    UNFOLLOW_USER,
  )

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
      const { result } = await toggleLikeButton({
        entityId: post.id,
        entityType: IUseLikesEntity.POST,
        isLiked: post.userLike?.liked ?? false,
      })

      const prevResults: IFetchallDiscoverPostsResponse | null =
        client.cache.readQuery({
          query: FETCH_ALL_DISCOVER_POSTS,
        })

      if (prevResults) {
        const newPost = [...prevResults.posts]
        const index = newPost.findIndex(v => v.id === post.id)

        const postLike = {
          ...newPost[index].postLike,
          ...result,
        }

        newPost[index] = {
          ...prevResults.posts[index],
          postLike,
          userLike: result?.userLike ? result.userLike : null,
        }

        client.cache.writeQuery({
          data: {
            posts: newPost,
          },
          overwrite: true,
          query: FETCH_ALL_DISCOVER_POSTS,
          broadcast: true,
        })
      }
    },
    [toggleLikeButton, client],
  )

  const onPressFollow = useCallback(
    async (userId: number, postId: number) => {
      await followUser({
        variables: {
          actorId: userId,
        },
        update: (cache, _data) => {
          const prev: IFetchallDiscoverPostsResponse | null = cache.readQuery({
            query: FETCH_ALL_DISCOVER_POSTS,
          })

          if (prev) {
            const newPosts = [...prev.posts]
            const index = newPosts.findIndex(v => v.id === postId)

            newPosts[index] = {
              ...newPosts[index],
              isFollowed: _data.data?.followUser,
            }

            cache.writeQuery({
              query: FETCH_ALL_DISCOVER_POSTS,
              data: {
                posts: newPosts,
              },
            })
          }
        },
      })
    },
    [followUser],
  )

  const onPressUnfollow = useCallback(
    async (userId: number, postId: number) => {
      await unfollowUser({
        variables: {
          actorId: userId,
        },
        update: (cache, _data) => {
          const prev: IFetchallDiscoverPostsResponse | null = cache.readQuery({
            query: FETCH_ALL_DISCOVER_POSTS,
          })

          if (prev) {
            const newPosts = [...prev.posts]
            const index = newPosts.findIndex(v => v.id === postId)

            newPosts[index] = {
              ...newPosts[index],
              isFollowed: null,
            }

            cache.writeQuery({
              query: FETCH_ALL_DISCOVER_POSTS,
              data: {
                posts: newPosts,
              },
            })
          }
        },
      })
    },
    [unfollowUser],
  )
  const renderItemComponent = useCallback(
    (item: IPost) => {
      switch (item.type) {
        case PostType.Youtube:
          return (
            <YoutubePost
              post={item}
              user={item.user}
              onPressLike={() => onPressLike(item)}
              onPressFollow={() => onPressFollow(item.user.id, item.id)}
              onPressUnfollow={() => onPressUnfollow(item.user.id, item.id)}
              onPressComment={() =>
                navigate(Routes.PostDetails, {
                  postId: item.id,
                })
              }
              onPressSave={() => null}
              key={item.id}
              isLiked={item.userLike?.liked ?? false}
              isFollowed={item?.isFollowed ? true : false}
            />
          )

        case PostType.Instagram:
          return (
            <InstagramPost
              post={item}
              user={item.user}
              onPressLike={() => onPressLike(item)}
              onPressFollow={() => onPressFollow(item.user.id, item.id)}
              onPressUnfollow={() => onPressUnfollow(item.user.id, item.id)}
              onPressComment={() =>
                navigate(Routes.PostDetails, {
                  postId: item.id,
                })
              }
              onPressSave={() => null}
              key={item.id}
              isLiked={item.userLike?.liked ?? false}
              isFollowed={item?.isFollowed ? true : false}
            />
          )
        case PostType.Twitter:
          return (
            <TwitterPost
              post={item}
              user={item.user}
              onPressLike={() => onPressLike(item)}
              onPressFollow={() => onPressFollow(item.user.id, item.id)}
              onPressUnfollow={() => onPressUnfollow(item.user.id, item.id)}
              onPressComment={() =>
                navigate(Routes.PostDetails, {
                  postId: item.id,
                })
              }
              onPressSave={() => null}
              key={item.id}
              isLiked={item.userLike?.liked ?? false}
              isFollowed={item?.isFollowed ? true : false}
            />
          )

        default:
          return (
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
              isLiked={item.userLike?.liked ?? false}
            />
          )
      }
    },
    [onPressLike, onPressFollow, onPressUnfollow],
  )

  const renderItem = useCallback(
    ({ item }: { item: IPost }) => {
      return <View marginV-20>{renderItemComponent(item)}</View>
    },
    [renderItemComponent],
  )

  const fetchMorePosts = useCallback(() => {
    if (data?.posts && data.posts.length > 15) {
      fetchMoreData({
        offset: data.posts.length,
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
      <BigList
        renderItem={renderItem}
        data={data?.posts}
        contentContainerStyle={{ padding: 10 }}
        onEndReached={fetchMorePosts}
        onEndReachedThreshold={0.5}
        removeClippedSubviews
        refreshControl={refreshControl()}
        itemHeight={350}
      />
    </Page>
  )
}
