import { IUser } from '@/Types/login.types'
import { RTCSessionDescriptionType } from 'react-native-webrtc'

export enum JoinRole {
  Listener = 0,
  Talk = 1,
}

export enum SocketListenerEvents {
  ClientPaired = 'clientPaired',
  AnswerMade = 'answer-made',
  CallMade = 'call-made',
  HangedUpCall = 'user hanged up call',
  ClientDisconnected = 'client disconnected',
  CallIsRetrieved = 'call is retrieved',
  AbuseDetected = 'abuse is detected',
  ActorIsTyping = 'user is done with typing',
  Messages = 'message',
  UserIsOnline = 'user is online',
  RemoveMessageRequested = 'remove message requested',
  SeenStatusUpdated = 'seen status updated',
}

export enum SocketFireEvents {
  JoinQueue = 'joinQueue',
  JoinRoom = 'join room',
  CallUser = 'call-user',
  MakeAnswer = 'make-answer',
  HangUpCall = 'hang up call',
  CallCloseRequest = 'call retrieve request',
  SendMessage = 'send message',
  LeaveRoom = 'leave room',
  LeaveQueue = 'leave queue',
  Typing = 'user is typing',
  CheckIfUserIsConnected = 'user is already connected',
  RemoveMessageRequest = 'remove single message request',
  UpdateSeenStatus = 'seen status',
}

export interface IClientPairedData {
  clientId: string
  roomName: string
  pairedUser: string
}

export interface IJoinRoomArg {
  roomName: string
  pairedClientId?: string
  user?: IUser
}

export interface ISendMessageResponse {
  id: number
  message: string
  clientId: string
  date: string
  user: IUser
  receiver: IUser
  roomName: string
  roomId: number
}
export interface ISendMessageData {
  firstJoined: boolean
  message?: string
  user: IUser
  reciever: IUser
  roomName: string
}

export interface IAnswerMadeResponse {
  socket: string
  answer: RTCSessionDescriptionType
}

export interface ICallMadeResponse {
  offer: RTCSessionDescriptionType
  socket: string
}
export interface IHangUpResponse {
  hangup: boolean
}

export interface IOnlineUser {
  clientId: string
  user: IUser
}

export interface ITypingResponse {
  typing: boolean
  roomAdress: string
}
export interface ITypingData {
  typing: boolean
  roomAdress: string
}

export interface IRemoveMessageRequested {
  messageId: number
}

export interface IUpdateSeenStatus {
  roomId: number
  roomAdress: string
  seen: boolean
}

export interface ISeenStatusUpdated {
  seen: boolean
}
