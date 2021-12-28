import { INotificationSettings } from '@/Types/notification.type'
import { gql } from '@apollo/client'

export interface IFetchNotificationSettingsResponse {
  notificationSettings: INotificationSettings
}

export const FETCH_NOTIFICATION_SETTINGS = gql`
  query FETCH_NOTIFICATION_SETTINGS {
    notificationSettings {
      follower
      messageRequest
      comments
      disableAll
    }
  }
`
