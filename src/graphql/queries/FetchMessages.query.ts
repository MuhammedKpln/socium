import gql from 'graphql-tag'

export const FETCH_MESSAGES = gql`
  query FETCH_MESSAGES {
    messages(pagination: { offset: 0, limit: 10 }) {
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
