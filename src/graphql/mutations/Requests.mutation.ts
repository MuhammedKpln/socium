import { IMessageRequests } from '@/types/messages.types'
import gql from 'graphql-tag'

export interface IAcceptRequestVariables {
  receiverId: number
  id: number
}
export interface IAcceptRequestResponse {
  acceptRequest: Pick<IMessageRequests, 'request'>
}
export interface IRejectRequestVariables {
  id: number
}
export interface IRejectRequestResponse {
  rejectRequest: boolean
}

export const ACCEPT_REQUEST = gql`
  mutation ACCEPT_REQUEST($receiverId: Float!, $id: Float!) {
    acceptRequest(receiverId: $receiverId, id: $id) {
      request
    }
  }
`
export const REJECT_REQUEST = gql`
  mutation REJECT_REQUEST($id: Float!) {
    rejectRequest(id: $id)
  }
`
