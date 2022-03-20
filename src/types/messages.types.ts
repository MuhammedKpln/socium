import type { IUser } from './login.types'

export interface IRoom {
  id: number
  created_at: Date
  updated_at: Date
  roomAdress: string
  expireDate: Date
}

export interface IMessage {
  id: number
  created_at: Date
  updated_at: Date
  message: string
  seen: boolean
  room: IRoom
  sender: IUser
  receiver: IUser
  senderId?: number
  repliedToMessage?: IMessage
}

export interface IMessagesRoom {
  message: string
  room: IRoom
  sender: IUser
  receiver: IUser
}

export interface ISendMessage {
  userId: number
  receiverId: number
  roomAdress: string
  message: string
}

export interface ISendNewRequest {
  requestFrom: { id: number }
  requestTo: { id: number }
  id: number
  created_at: Date
  updated_at: Date
  request: boolean
}

export interface IMessageRequests {
  id: number
  created_at: Date
  updated_at: Date
  request: boolean
  requestFrom: IUser
  requestTo: IUser
}
