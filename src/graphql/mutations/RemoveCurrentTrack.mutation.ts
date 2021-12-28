import { gql } from '@apollo/client'

export const REMOVE_CURRENT_TRACK = gql`
  mutation REMOVE_CURRENT_TRACK {
    removeCurrentTrack
  }
`
