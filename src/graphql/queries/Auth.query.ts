import { gql } from '@apollo/client'

export const CHECK_IF_USER_IS_REGISTERED = gql`
  query CHECK_IF_USER_IS_REGISTERED($email: String!) {
    checkIfUserIsRegistered(email: $email)
  }
`
