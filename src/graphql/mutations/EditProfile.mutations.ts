import { UserFragment } from '@/graphql/fragments/User.fragment'
import { gql } from '@apollo/client'

export const EDIT_PROFILE = gql`
  ${UserFragment}
  mutation EDIT_PROFILE(
    $biography: String
    $username: String
    $blockIncomingCalls: Boolean
    $birthday: DateTime!
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
