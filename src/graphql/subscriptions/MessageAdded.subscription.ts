import type { IMessage } from '@/types/messages.types'
import { gql } from '@apollo/client'

export interface IMessageSendedSubscriptionVariables {
  userId: number
}
export interface IMessageSendedSubscriptionResponse {
  messageSended: IMessage
}

export const MESSAGE_SENDED_SUBSCRIPTION = gql`
  subscription MESSAGE_SENDED($userId: Float!) {
    messageSended(userId: $userId) {
      id
      message
      seen
      sender {
        id
        username
        avatar
      }
      receiver {
        id
        username
        avatar
      }
      room {
        id
        roomAdress
      }
    }
  }
`
