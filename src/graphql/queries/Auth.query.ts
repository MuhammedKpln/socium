import { gql } from '@apollo/client'

export interface ICheckIfUserIsRegisteredVariables {
  email: string
}

export interface ICheckIfUserIsRegisteredResponse {
  checkIfUserIsRegistered: boolean
}

export const CHECK_IF_USER_IS_REGISTERED = gql`
  query CHECK_IF_USER_IS_REGISTERED($email: String!) {
    checkIfUserIsRegistered(email: $email)
  }
`
