import { gql } from '@apollo/client'

export const UPDATE_CURRENT_TRACK = gql`
  mutation UPDATE_CURRENT_TRACK(
    $songName: String!
    $artistName: String!
    $imageUrl: String!
  ) {
    updateCurrentTrack(
      data: {
        songName: $songName
        artistName: $artistName
        imageUrl: $imageUrl
      }
    )
  }
`
