import { gql } from '@apollo/client'

export interface IRateUserArgs {
  userId: number
  rating: 1 | 2 | 3 | 4 | 5
}
export interface IRateUserResponse {
  rateUser: boolean
}

export const RATE_USER = gql`
  mutation RATE_USER($userId: Float!, $rating: Float!) {
    rateUser(rate: { rating: $rating, userId: $userId })
  }
`
