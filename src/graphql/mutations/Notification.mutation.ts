import { gql } from '@apollo/client'

export interface IMarkAllNotificationAsReadResponse {
  markAllNotificationAsRead: boolean
}

export const MARK_NOTIFICATION_AS_READ = gql`
  mutation MARK_NOTIFICATION_AS_READ($id: Float!) {
    markNotificationAsRead(id: $id)
  }
`
export const MARK_ALL_NOTIFICATION_AS_READ = gql`
  mutation MARK_ALL_NOTIFICATION_AS_READ {
    markAllNotificationAsRead
  }
`
