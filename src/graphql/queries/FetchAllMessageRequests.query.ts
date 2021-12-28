import { gql } from '@apollo/client'

export const FETCH_ALL_MESSAGE_REQUEST_SENDED = gql`
  query FETCH_ALL_MESSAGE_REQUEST_SENDED(
    $limit: Float! = 15
    $offset: Float! = 0
  ) {
    messageRequestsSended(pagination: { limit: $limit, offset: $offset }) {
      requestTo {
        id
      }
    }
  }
`
