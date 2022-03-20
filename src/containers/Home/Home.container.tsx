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
import { updateCurrentTrackInterval } from '@/services/spotify.service'
import { useAppSelector } from '@/store'
import { fetchAvatars } from '@/store/reducers/app.reducer'
import { fetchUserStars } from '@/store/reducers/user.reducer'
import type { IPost } from '@/types/post.types'
import { configureNotifications } from '@/utils/notifications'
import { showToast, ToastStatus } from '@/utils/toast'
import { useQuery } from '@apollo/client'
import React, { useCallback, useEffect } from 'react'
import { FlatList } from 'react-native'
import { Platform, RefreshControl } from 'react-native'
import { Notifications } from 'react-native-notifications'
import { View } from 'react-native-ui-lib'
import Text from 'react-native-ui-lib/text'
import { useDispatch } from 'react-redux'

if (Platform.OS !== 'ios') {
  configureNotifications()
}

const HomeContainer = () => {
  const { toggleLikeButton } = useLikes()

  const dispatch = useDispatch()
  const isLoggedIn = useAppSelector(state => state.userReducer.isLoggedIn)
  const notifications = useAppSelector(state => state.appReducer.notifications)
  const spotifyLoggedIn = useAppSelector(
    state => state.spotifyReducer.accessToken,
  )
  const fetchPosts = useQuery<{ posts: IPost[] }, IFetchPostsVariables>(
    FETCH_POSTS,
    {
      variables: {
        offset: 0,
        limit: 15,
      },
      onCompleted() {
        if (isLoggedIn) {
          dispatch(fetchUserStars())
        }
      },
    },
  )

  useEffect(() => {
    dispatch(fetchAvatars())
  }, [dispatch])

  useEffect(() => {
    if (isLoggedIn && notifications) {
      Notifications.registerRemoteNotifications()
    }

    if (isLoggedIn && spotifyLoggedIn) {
      updateCurrentTrackInterval()
    }
  }, [isLoggedIn, notifications, spotifyLoggedIn])

  const likePost = useCallback(
    async (props: IUseLikesProps) => {
      const { result } = await toggleLikeButton(props)

      const prevResults: IFetchPostsResponse | null =
        fetchPosts.client.cache.readQuery({
          query: FETCH_POSTS,
        })

      if (prevResults) {
        const newPost = [...prevResults.posts]
        const index = newPost.findIndex(v => v.id === props.entityId)

        const postLike = {
          ...newPost[index].postLike,
          ...result,
        }

        newPost[index] = {
          ...prevResults.posts[index],
          postLike,
          userLike: result?.userLike ? result.userLike : null,
        }

        console.log('qweqweq', prevResults?.posts[index])

        fetchPosts.client.cache.writeQuery({
          data: {
            posts: newPost,
          },
          overwrite: true,
          query: FETCH_POSTS,
          broadcast: true,
        })
      }
    },
    [toggleLikeButton, fetchPosts.client.cache],
  )

  function onPressSave() {
    showToast(ToastStatus.Success, 'Kaydedilenlerinize ekleni.')
  }

  const fetchMorePosts = useCallback(() => {
    if (fetchPosts.data?.posts && fetchPosts.data.posts.length <= 15) return

    fetchPosts.fetchMore({
      variables: {
        offset: fetchPosts.data?.posts.length,
      },
    })
  }, [fetchPosts])

  const renderItem = useCallback(
    ({ item }: { item: IPost }) => {
      return (
        <View key={item.slug}>
          <Post
            commentsCount={item._count.comment}
            date={item.created_at}
            likesCount={item.postLike.likeCount}
            onPressPost={() => {
              navigate(Routes.PostDetails, { postId: item.id })
            }}
            postType={item.type}
            additional={item.additional}
            isLiked={item.userLike?.liked || false}
            user={item.user}
            onPressRemove={() => null}
            content={item.content}
            onPressComment={() => null}
            onPressSave={onPressSave}
            onPressLike={() =>
              likePost({
                entityId: item.id,
                entityType: IUseLikesEntity.POST,
                isLiked: item.userLike?.liked || false,
              })
            }
          />
        </View>
      )
    },
    [likePost],
  )

  const refreshControl = useCallback(() => {
    return (
      <RefreshControl
        refreshing={fetchPosts.loading}
        onRefresh={fetchPosts.refetch}
      />
    )
  }, [fetchPosts])

  const getItemLayout = useCallback(
    (data: any, index: number) => ({
      length: 280,
      offset: 280 * index,
      index,
    }),
    [],
  )

  const renderContent = useCallback(() => {
    return (
      <View style={{ display: 'flex', height: '100%' }}>
        <FlatList
          data={fetchPosts.data?.posts}
          renderItem={renderItem}
          ListEmptyComponent={() => <Text>empty</Text>}
          ListHeaderComponent={() => (
            <Text title textColor>
              🚀 Öne çıkanlar
            </Text>
          )}
          onEndReached={fetchMorePosts}
          onEndReachedThreshold={0.1}
          getItemLayout={getItemLayout}
          refreshControl={refreshControl()}
        />
      </View>
    )
  }, [
    fetchPosts.data?.posts,
    renderItem,
    fetchMorePosts,
    getItemLayout,
    refreshControl,
  ])

  return (
    <Page>
      <SkeletonView
        showContent={!fetchPosts.loading}
        template={SkeletonViewTemplates.LIST_ITEM}
        renderContent={renderContent}
        times={8}
      />
    </Page>
  )
}

export default HomeContainer
