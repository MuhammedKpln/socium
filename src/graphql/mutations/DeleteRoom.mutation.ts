import { IRoom } from '@/types/messages.types'
import { gql } from '@apollo/client'

export interface IDeleteRoomResponse {
  deleteRoom: IRoom
}

export interface IDeleteRoomVariables {
  roomId: number
}

export const DELETE_ROOM = gql`
  mutation DELETE_ROOM($roomId: Float!) {
    deleteRoom(roomId: $roomId) {
      id
    }
  }
`
