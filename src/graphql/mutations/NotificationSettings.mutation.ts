import { gql } from '@apollo/client'

export interface IEditNotificationSettingsResponse {
  editNotificationSettings: boolean
}

export interface IEditNotificationSettingsVariables {
  follower: boolean
  messageRequest: boolean
  comments: boolean
  disableAll: boolean
}

export const EDIT_NOTIFICATION_SETTINGS = gql`
  mutation EDIT_NOTIFICATION_SETTINGS(
    $follower: Boolean
    $messageRequest: Boolean
    $comments: Boolean
    $disableAll: Boolean
  ) {
    editNotificationSettings(
      settings: {
        follower: $follower
        messageRequest: $messageRequest
        comments: $comments
        disableAll: $disableAll
      }
    )
  }
`
