import { gql } from '@apollo/client'

export const GET_USER_CURRENT_TRACK = gql`
  query GET_USER_CURRENT_TRACK($userId: Float!) {
    getUserCurrentTrack(userId: $userId) {
      songName
      artistName
      image
    }
  }
`
