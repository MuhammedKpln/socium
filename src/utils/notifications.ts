import { client } from '@/App'
import { UPDATE_FCM_TOKEN } from '@/graphql/mutations/UpdateFcmToken.mutation'
import { Routes } from '@/navigators/navigator.props'
import { navigate, navigationRef } from '@/navigators/utils/navigation'
import { EncryptedStorageKeys, storage } from '@/storage'
import { store } from '@/store'
import {
  NotificationCompletion,
  Notifications,
} from 'react-native-notifications'
import { IToastAdditionalOptions, showToast, ToastStatus } from './toast'

export const configureNotifications = async () => {
  Notifications.events().registerRemoteNotificationsRegistered(async event => {
    const isLoggedIn = store.getState().userReducer.isLoggedIn
    const notifications = store.getState().appReducer.notifications

    if (!isLoggedIn || !notifications) return

    const savedToken = await storage.getStringAsync(
      EncryptedStorageKeys.FcmToken,
    )

    if (savedToken === event.deviceToken) {
      console.log('Token matches with saved token.')

      return true
    }

    const saveFcmToken = await client.mutate({
      mutation: UPDATE_FCM_TOKEN,
      variables: {
        fcmToken: event.deviceToken,
      },
    })

    const savedSuccessfully = saveFcmToken.data.saveUserFcmToken

    if (savedSuccessfully) {
      return true
    }

    return false
  })

  Notifications.events().registerRemoteNotificationsRegistrationFailed(
    event => {
      console.error(event)
    },
  )

  Notifications.events().registerNotificationReceivedForeground(
    (notification, completion: (response: NotificationCompletion) => void) => {
      console.log('Notification Received - Foreground', notification.payload)

      const { entity, entityType } = notification.payload
      const title = notification.payload['gcm.notification.title']
      const body = notification.payload['gcm.notification.body']

      let toastOptions: IToastAdditionalOptions = {}
      if (entityType === 'message') {
        const onPress = () => {
          const _entity = JSON.parse(entity)
          navigate(Routes.Chat, {
            room: _entity.room,
            user: _entity.user,
          })
        }

        Object.assign(toastOptions, {
          action: {
            label: 'Göster',
            onPress,
          },
        })
      }

      if (body || title) {
        const currentRoute = navigationRef.current?.getCurrentRoute()

        if (
          (currentRoute && currentRoute.name === Routes.Chat) ||
          (currentRoute && currentRoute.name === Routes.Chats)
        ) {
          //DO anything
        } else showToast(ToastStatus.Info, `${title}`, toastOptions)
      }

      // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
      completion({ alert: true, sound: true, badge: false })
    },
  )
}
