import gql from 'graphql-tag'

export const FETCH_USER_REQUESTS = gql`
  query FETCH_USER_REQUESTS($toUserId: Float!) {
    checkForRequests(toUserId: $toUserId) {
      id
      request
    }
  }
`
