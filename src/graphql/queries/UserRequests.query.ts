import gql from 'graphql-tag'

export interface IFetchUserRequestsVariables {
  toUserId: number
}

export interface IFetchUserRequestsResponse {
  checkForRequests: {
    id: number
    request: boolean
  }
}

export const FETCH_USER_REQUESTS = gql`
  query FETCH_USER_REQUESTS($toUserId: Float!) {
    checkForRequests(toUserId: $toUserId) {
      id
      request
    }
  }
`
