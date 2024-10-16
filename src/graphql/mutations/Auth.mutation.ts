import { UserFragment } from '@/graphql/fragments/User.fragment'
import type { ILogin } from '@/Types/login.types'
import { gql } from '@apollo/client'

export interface IRegisterWithGoogleVariables {
  username: string
  idToken: string
  email: string
}

export interface IRegisterWithGoogleResponse {
  registerWithGoogle: ILogin
}

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

export interface ILoginWithGoggleVariables {
  email: string
  idToken: string
}

export interface ILoginWithGoogleResponse {
  loginGoogle: ILogin
}

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

export interface ILoginVariables {
  email: string
  password: string
}

export interface ILoginResponse {
  login: ILogin
}

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

export interface IRegisterVariables {
  username: string
  password: string
  passwordConfirmation: string
  email: string
}

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
      access_token
      refresh_token
      expire_date
      user {
        ...UserFields
      }
    }
  }
`
