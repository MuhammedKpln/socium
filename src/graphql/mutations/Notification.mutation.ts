import { gql } from '@apollo/client'

export const MARK_NOTIFICATION_AS_READ = gql`
  mutation MARK_NOTIFICATION_AS_READ($id: Float!) {
    markNotificationAsRead(id: $id)
  }
`
