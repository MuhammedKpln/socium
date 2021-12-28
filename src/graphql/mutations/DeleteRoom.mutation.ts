import { gql } from '@apollo/client'

export const DELETE_ROOM = gql`
  mutation DELETE_ROOM($roomId: Float!) {
    deleteRoom(roomId: $roomId)
  }
`
