import { IMessage, IMessageRequests } from '@/types/messages.types'
import gql from 'graphql-tag'

export interface IFetchMessagesResponse {
  messages: IMessage[]
}
export interface IFetchMessagesVariables {
  offset?: number
  limit?: number
}

export interface IFetchMessageRequestResponse {
  messageRequests: IMessageRequests[]
}
export interface IFetchMessageRequestVariables {
  offset?: number
  limit?: number
}

export const FETCH_MESSAGES = gql`
  query FETCH_MESSAGES {
    messages(pagination: { offset: 0, limit: 10 }) {
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
export const FETCH_MESSAGE_REQUESTS = gql`
  query FETCH_MESSAGE_REQUESTS {
    messageRequests(pagination: { offset: 0, limit: 10 }) {
      requestFrom {
        id
        username
        avatar
      }
      requestTo {
        id
        username
      }

      request
      id
    }
  }
`
