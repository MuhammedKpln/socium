import { gql } from '@apollo/client'

export const CHANGE_PASSWORD = gql`
  mutation CHANGE_PASSWORD(
    $email: String!
    $password: String!
    $forgotPasswordCode: Float!
  ) {
    changePassword(
      data: {
        password: $password
        email: $email
        forgotPasswordCode: $forgotPasswordCode
      }
    )
  }
`
