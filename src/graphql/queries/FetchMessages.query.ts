import { IMessage, IMessageRequests } from '@/types/messages.types'
import gql from 'graphql-tag'
import { UserFragment } from '../fragments/User.fragment'

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

export interface IFetchRoomMessagesResponse {
  messagesFromRoom: IMessage[]
}

export interface IFetchRoomMessagesVariables {
  roomId: number
  offset?: number
  limit?: number
}

export const FETCH_ROOM_MESSAGES = gql`
  ${UserFragment}
  query FETCH_ROOM_MESSAGE(
    $roomId: Float!
    $offset: Float = 0
    $limit: Float = 15
  ) {
    messagesFromRoom(
      roomId: $roomId
      pagination: { offset: $offset, limit: $limit }
    ) {
      sender {
        ...UserFields
      }
      receiver {
        ...UserFields
      }
      room {
        id
        roomAdress
      }
      seen
      message
      created_at
      id
    }
  }
`
