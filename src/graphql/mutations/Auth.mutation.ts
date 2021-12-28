import { UserFragment } from '@/graphql/fragments/User.fragment'
import { gql } from '@apollo/client'

export const REGISTER_WITH_GOOGLE = gql`
  ${UserFragment}
  mutation GOOGLE_REGISTER(
    $username: String!
    $idToken: String!
    $email: String!
  ) {
    registerWithGoogle(
      data: { username: $username, email: $email, idToken: $idToken }
    ) {
      access_token
      refresh_token
      expire_date
      user {
        ...UserFields
      }
    }
  }
`

export const LOGIN_GOOGLE = gql`
  ${UserFragment}

  mutation LOGIN_GOOGLE($email: String!, $idToken: String!) {
    loginGoogle(data: { email: $email, idToken: $idToken }) {
      access_token
      refresh_token
      expire_date
      user {
        ...UserFields
      }
    }
  }
`

export const LOGIN = gql`
  ${UserFragment}

  mutation Login($email: String!, $password: String!) {
    login(data: { email: $email, password: $password }) {
      access_token
      refresh_token
      expire_date
      user {
        ...UserFields
      }
    }
  }
`

export const REGISTER = gql`
  ${UserFragment}

  mutation REGISTER(
    $username: String!
    $password: String!
    $passwordConfirmation: String!
    $email: String!
  ) {
    register(
      data: {
        username: $username
        password: $password
        password_confirmation: $passwordConfirmation
        email: $email
      }
    ) {
      ...UserFields
    }
  }
`
