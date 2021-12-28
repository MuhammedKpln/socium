import { client } from '@/App'
import { UPDATE_FCM_TOKEN } from '@/graphql/mutations/UpdateFcmToken.mutation'
import { EncryptedStorageKeys, storage } from '@/storage'
import { Notifications } from 'react-native-notifications'

export const configureNotifications = async () => {
  Notifications.events().registerRemoteNotificationsRegistered(async event => {
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
    (notification, completion: (response) => void) => {
      console.log('Notification Received - Foreground', notification.payload)

      // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
      completion({ alert: true, sound: true, badge: false })
    },
  )
}
