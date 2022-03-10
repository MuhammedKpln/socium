import { Avatar } from '@/components/Avatar/Avatar.component'
import Button, { ButtonSizes } from '@/components/Button/Button.component'
import { NotFound } from '@/components/NotFound/NotFound.component'
import { Page } from '@/components/Page/Page.component'
import {
  SkeletonView,
  SkeletonViewContentTypes,
  SkeletonViewTemplates,
} from '@/components/SkeletonView/SkeletonView.component'
import {
  IMarkAllNotificationAsReadResponse,
  MARK_ALL_NOTIFICATION_AS_READ,
} from '@/graphql/mutations/Notification.mutation'
import {
  FETCH_NOTIFICATIONS,
  IFetchNotificationsResponse,
} from '@/graphql/queries/Notification.query'
import { Routes } from '@/navigators/navigator.props'
import type { IComment } from '@/types/comment.types'
import type { IFollowers } from '@/types/followers.types'
import type { INotification } from '@/Types/notification.type'
import type { IPost } from '@/types/post.types'
import { NotificationHelper } from '@/utils/notification'
import { useMutation, useQuery } from '@apollo/client'
import { useNavigation } from '@react-navigation/native'
import dayjs from 'dayjs'
import React, { useCallback, useLayoutEffect } from 'react'
import { FlatList, RefreshControl } from 'react-native'
import { Colors, ListItem, Text, View } from 'react-native-ui-lib'

export function NotificationContainer() {
  const navigation = useNavigation()
  const { data, loading, refetch } =
    useQuery<IFetchNotificationsResponse>(FETCH_NOTIFICATIONS)
  const [markAllNotificationsAsRead, markAllNotificationsAsReadMeta] =
    useMutation<IMarkAllNotificationAsReadResponse>(
      MARK_ALL_NOTIFICATION_AS_READ,
      {
        onCompleted: async () => {
          await refetch()
        },
      },
    )

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: renderHeader,
    })
  })

  const onPressNotification = useCallback(
    (
      entityType: 'post' | 'follower' | 'comment',
      entity: IPost & IComment & IFollowers,
    ) => {
      switch (entityType) {
        case 'post':
          navigation.goBack()
          navigation.navigate(Routes.PostDetails, { postId: entity.id })
          break

        case 'follower':
          navigation.goBack()
          navigation.navigate(Routes.MyProfile, {
            username: entity.user.username,
          })
          break
      }
    },
    [navigation],
  )

  const renderItem = useCallback(
    ({ item }: { item: INotification }) => {
      const notificationText = new NotificationHelper(item).renderText(
        item.user.username,
        item.actor.username,
      )

      return (
        <ListItem
          containerStyle={{
            justifyContent: 'space-between',
          }}
          onPress={() => onPressNotification(item.entityType, item.entity)}
        >
          <ListItem.Part left>
            <Avatar
              userAvatar={item.user.avatar}
              badgeProps={{ size: 10 }}
              showBadge={!item.readed}
            />
          </ListItem.Part>
          <ListItem.Part middle column containerStyle={{ marginLeft: 10 }}>
            <View row spread>
              <Text fontGilroy textColor>
                {item.user.username}
              </Text>
              <Text greyText fontGilroy font12>
                {dayjs(item.created_at).fromNow()}
              </Text>
            </View>
            <Text greyText>{notificationText}</Text>
          </ListItem.Part>
        </ListItem>
      )
    },
    [onPressNotification],
  )

  const renderHeader = useCallback(() => {
    return (
      <View flex row spread marginV-10 marginH-10>
        <Text font17 bold left textColor>
          Bildirimler
        </Text>
        <Button
          right
          marginR-15
          label="Hepsini okundu olarak işaretle"
          link
          linkColor={Colors.primary}
          size={ButtonSizes.small}
          onPress={markAllNotificationsAsRead}
          loading={markAllNotificationsAsReadMeta.loading}
        />
      </View>
    )
  }, [markAllNotificationsAsRead, markAllNotificationsAsReadMeta])

  const renderContent = useCallback(() => {
    if (!data?.getNotifications) return null

    return (
      <View style={{ display: 'flex', height: '100%' }}>
        <FlatList
          data={[...data?.getNotifications, ...data?.getReadedNotifications]}
          ListEmptyComponent={() => (
            <NotFound
              size={300}
              title="Herhangi bir bildirim bulunmamakta"
              subtitle=""
            />
          )}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refetch} />
          }
          refreshing={loading}
          onRefresh={refetch}
          renderItem={renderItem}
        />
      </View>
    )
  }, [
    data?.getNotifications,
    data?.getReadedNotifications,
    loading,
    refetch,
    renderItem,
  ])

  return (
    <Page>
      <SkeletonView
        renderContent={renderContent}
        showContent={!loading}
        template={SkeletonViewTemplates.LIST_ITEM}
        listProps={{
          contentType: SkeletonViewContentTypes.AVATAR,
          showLastSeparator: true,
        }}
      />
    </Page>
  )
}
