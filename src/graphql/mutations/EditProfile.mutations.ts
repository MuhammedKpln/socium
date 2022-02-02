import { UserFragment } from '@/graphql/fragments/User.fragment'
import { IUser } from '@/types/login.types'
import { gql } from '@apollo/client'

export interface IEditProfileVariables {
  username?: string
  biography?: string
  blockIncomingCalls?: boolean
  birthday?: Date
  avatar?: string
}

export interface IEditProfileResponse {
  editProfile: IUser
}

export const EDIT_PROFILE = gql`
  ${UserFragment}
  mutation EDIT_PROFILE(
    $biography: String
    $username: String
    $blockIncomingCalls: Boolean
    $birthday: DateTime
    $avatar: String
  ) {
    editProfile(
      profile: {
        bio: $biography
        username: $username
        blockIncomingCalls: $blockIncomingCalls
        birthday: $birthday
        avatar: $avatar
      }
    ) {
      ...UserFields
    }
  }
`
