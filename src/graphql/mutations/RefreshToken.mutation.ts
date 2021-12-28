import { gql } from '@apollo/client'

export const REFRESH_TOKEN = gql`
  mutation REFRESH_TOKEN($refreshToken: String!, $userId: Float!) {
    refreshToken(refreshToken: $refreshToken, userId: $userId) {
      access_token
      refresh_token
      expire_date
    }
  }
`
