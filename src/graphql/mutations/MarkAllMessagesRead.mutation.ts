import { gql } from '@apollo/client'

export const MARK_ALL_MESSAGES_READ = gql`
  mutation MARK_ALL_MESSAGES_READ($roomId: Float!) {
    markAllMessagesRead(roomId: $roomId)
  }
`
