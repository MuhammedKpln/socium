import { Avatar } from '@/components/Avatar/Avatar.component'
import Button from '@/components/Button/Button.component'
import { NotFound } from '@/components/NotFound/NotFound.component'
import { Page } from '@/components/Page/Page.component'
import {
  SkeletonView,
  SkeletonViewContentTypes,
  SkeletonViewTemplates,
} from '@/components/SkeletonView/SkeletonView.component'
import {
  FOLLOW_USER,
  IFollowArgs,
  IFollowUserResponse,
  IUnFollowUserResponse,
  UNFOLLOW_USER,
} from '@/graphql/mutations/Follower.mutation'
import {
  IUserFollowersResponse,
  IUserFollowersVariables,
  IUserFollowingsResponse,
  IUserFollowingsVariables,
  USER_FOLLOWERS,
  USER_FOLLOWINGS,
} from '@/graphql/queries/Follower.query'
import { Routes } from '@/navigators/navigator.props'
import { navigate } from '@/navigators/utils/navigation'
import { useAppSelector } from '@/store'
import { IFollowers } from '@/Types/followers.types'
import { useMutation, useQuery } from '@apollo/client'
import React, { useCallback } from 'react'
import { FlatList } from 'react-native'
import { Colors, Typography } from 'react-native-ui-lib'
import ListItem from 'react-native-ui-lib/listItem'
import Text from 'react-native-ui-lib/text'
import View from 'react-native-ui-lib/view'

interface IProps {
  userId: number
}

export function Followers(props: IProps) {
  const localUser = useAppSelector(state => state.userReducer.user)
  const { data, loading } = useQuery<
    IUserFollowersResponse,
    IUserFollowersVariables
  >(USER_FOLLOWERS, {
    variables: {
      userId: props.userId,
    },
  })
  const myFollowings = useQuery<
    IUserFollowingsResponse,
    IUserFollowingsVariables
  >(USER_FOLLOWINGS, {
    fetchPolicy: 'cache-first',
    variables: {
      userId: localUser?.id ?? 0,
    },
  })

  const [followUser, followUserMeta] = useMutation<
    IFollowUserResponse,
    IFollowArgs
  >(FOLLOW_USER)
  const [unfollowUser, unfollowUserMeta] = useMutation<
    IUnFollowUserResponse,
    IFollowArgs
  >(UNFOLLOW_USER)

  const onPressFollowUser = useCallback(
    async userId => {
      await followUser({
        variables: {
          actorId: userId,
        },
        update: (cache, _data) => {
          const prev: IUserFollowingsResponse | null = cache.readQuery({
            query: USER_FOLLOWINGS,
            variables: {
              userId: localUser?.id,
            },
          })

          console.log(prev, _data.data)

          if (prev && _data) {
            const newData = [...prev.getUserFollowings, _data.data?.followUser]

            cache.writeQuery({
              query: USER_FOLLOWINGS,
              variables: {
                userId: localUser?.id,
              },
              data: {
                getUserFollowings: newData,
              },
            })
          }
        },
      })
    },
    [followUser, localUser?.id],
  )
  const onPressUnfollowUser = useCallback(
    async userId => {
      await unfollowUser({
        variables: {
          actorId: userId,
        },
        update: (cache, _data) => {
          const prev: IUserFollowingsResponse | null = cache.readQuery({
            query: USER_FOLLOWINGS,
            variables: {
              userId: localUser?.id,
            },
          })

          if (prev && _data) {
            const newData = prev.getUserFollowings.filter(
              v => v.actor.id !== userId,
            )

            cache.writeQuery({
              query: USER_FOLLOWINGS,
              variables: {
                userId: localUser?.id,
              },
              data: {
                getUserFollowings: newData,
              },
            })
          }
        },
      })
    },
    [unfollowUser, localUser?.id],
  )

  const onPressUser = useCallback((username: string) => {
    navigate(Routes.MyProfile, {
      username,
    })
  }, [])

  const renderItem = useCallback(
    ({ item }: { item: IFollowers }) => {
      const myFollowingsIds = myFollowings?.data?.getUserFollowings.filter(
        v => v.actor.id === item.user.id,
      )

      const isFollowing = myFollowingsIds && myFollowingsIds?.length > 0

      return (
        <ListItem onPress={() => onPressUser(item.user.username)}>
          <ListItem.Part left>
            <Avatar userAvatar={item.user.avatar} />
          </ListItem.Part>
          <ListItem.Part middle>
            <View marginL-10>
              <Text textColor fontSfProMedium>
                {item.user.username}
              </Text>
              <Text greyText fontSfProMedium>
                @{item.user.username}
              </Text>
            </View>
          </ListItem.Part>
          {localUser?.id !== item.user.id && (
            <ListItem.Part right>
              <Button
                label={!isFollowing ? 'Takip et' : 'Takipten çık'}
                outline={!isFollowing}
                outlineColor={Colors.primary}
                style={{ height: 28, width: 100 }}
                loading={followUserMeta.loading || unfollowUserMeta.loading}
                avoidInnerPadding
                labelStyle={{ fontSize: Typography.font12.fontSize }}
                onPress={
                  !isFollowing
                    ? () => onPressFollowUser(item.user.id)
                    : () => onPressUnfollowUser(item.user.id)
                }
              />
            </ListItem.Part>
          )}
        </ListItem>
      )
    },
    [
      onPressFollowUser,
      onPressUnfollowUser,
      localUser?.id,
      myFollowings,
      onPressUser,
      followUserMeta,
      unfollowUserMeta,
    ],
  )

  const renderContent = useCallback(() => {
    return (
      <>
        <FlatList
          renderItem={renderItem}
          data={data?.getUserFollowers}
          ListEmptyComponent={
            <NotFound
              size={50}
              title="Kullanıcıyı takip eden kimse yok!"
              subtitle="İlk takip eden sen olmak ister misin?"
            />
          }
        />
      </>
    )
  }, [data, renderItem])

  return (
    <Page>
      <SkeletonView
        showContent={!loading && !myFollowings.loading}
        renderContent={renderContent}
        template={SkeletonViewTemplates.LIST_ITEM}
        times={data?.getUserFollowers.length || 5}
        listProps={{
          contentType: SkeletonViewContentTypes.AVATAR,
          showLastSeparator: true,
        }}
      />
    </Page>
  )
}
