import { UserFragment } from '@/graphql/fragments/User.fragment'
import { IUser } from '@/types/login.types'
import { gql } from '@apollo/client'

export interface IEditProfileVariables {
  username?: string
  biography?: string
  blockIncomingCalls?: boolean
  birthday?: Date
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
  ) {
    editProfile(
      profile: {
        bio: $biography
        username: $username
        blockIncomingCalls: $blockIncomingCalls
        birthday: $birthday
      }
    ) {
      ...UserFields
    }
  }
`
