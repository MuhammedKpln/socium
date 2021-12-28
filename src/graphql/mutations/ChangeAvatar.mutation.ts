import { gql } from '@apollo/client'

export const CHANGE_AVATAR = gql`
  mutation CHANGE_AVATAR($avatarBase64: String!, $avatarJson: String!) {
    editProfile(profile: { avatar: $avatarBase64, avatarMeta: $avatarJson }) {
      avatar
      userAvatarMeta {
        avatar
      }
    }
  }
`
