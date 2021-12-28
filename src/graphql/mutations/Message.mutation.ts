import { gql } from '@apollo/client'

export const NEW_MESSAGE_REQUEST = gql`
  mutation NEW_MESSAGE_REQUEST($toUserId: Float!) {
    newMessageRequest(toUserId: $toUserId)
  }
`
export const RETRIEVE_MESSAGE_REQUEST = gql`
  mutation RETRIEVE_MESSAGE_REQUEST($requestId: Float!) {
    retrieveMessageRequest(requestId: $requestId)
  }
`
