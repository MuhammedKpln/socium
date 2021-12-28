import gql from 'graphql-tag'

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
