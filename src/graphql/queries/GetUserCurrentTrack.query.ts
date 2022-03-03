import { gql } from '@apollo/client'

export interface IFetchUserCurrentTrackVariables {
  userId: number
}

export interface IFetchUserCurrentTrackResponse {
  getUserCurrentTrack: {
    songName: string
    artistName: string
    image: string
  }
}

export const GET_USER_CURRENT_TRACK = gql`
  query GET_USER_CURRENT_TRACK($userId: Float!) {
    getUserCurrentTrack(userId: $userId) {
      songName
      artistName
      image
    }
  }
`
