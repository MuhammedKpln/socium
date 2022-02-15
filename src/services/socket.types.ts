import { IUser } from '@/types/login.types'
import { IMessage } from '@/types/messages.types'
import { RTCIceCandidateType, RTCSessionDescription } from 'react-native-webrtc'

export enum JoinRole {
  Listener = 0,
  Talk = 1,
}

export enum SocketListenerEvents {
  ClientPaired = 'CLIENT_PAIRED',
  AnswerMade = 'ANSWER_MADE',
  CallMade = 'CALL_MADE',
  HangedUpCall = 'user hanged up call',
  ClientDisconnected = 'client disconnected',
  CallIsRetrieved = 'CALL_RETRIEVED',
  AbuseDetected = 'abuse is detected',
  Typing = 'USER_IS_TYPING',
  DoneTyping = 'USER_IS_DONE_TYPING',
  MessageReceived = 'MESSAGE_RECEIVED',
  UserIsOnline = 'user is online',
  RemoveMessageRequested = 'MESSAGE_REMOVED',
  SeenStatusUpdated = 'seen status updated',
  ReceivedIceCandidate = 'RECEIVED_ICE_CANDIDATE',
  MicMuted = 'MIC_MUTED',
}

export enum SocketFireEvents {
  JoinQueue = 'join queue',
  JoinRoom = 'join room',
  CallUser = 'call user',
  MakeAnswer = 'make answer',
  RetrieveCall = 'retrieve call',
  HangUpCall = 'hang up call',
  SendMessage = 'send message',
  LeaveRoom = 'leave room',
  LeaveQueue = 'leave queue',
  Typing = 'typing',
  CheckIfUserIsConnected = 'user is already connected',
  RemoveMessageRequest = 'remove single message request',
  UpdateSeenStatus = 'seen status',
  AddIceCandidate = 'add ice candidate',
  MuteMic = 'microphone muted',
}

interface IUUID {
  uuid: string
}

export interface IClientPairedData {
  room: string
  user: IUser
  uuid: string
}

export interface IMessageReceivedData {
  message: IMessage
}

export interface IUserIsTyping {
  typing: boolean
}

export interface IMessageRemoved {
  messageId: number
}

export interface IJoinQueueArgs {
  user: IUser
}

export interface IJoinRoomArg {
  room: string
}
export interface ISendMessageArg {
  room: string
  message?: string
  user: IUser
  receiver: IUser
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
  uuid: string
  answer: RTCSessionDescription
}

export interface ICallMadeResponse {
  offer: RTCSessionDescription
  uuid: string
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

export interface IIceCandidateReceived {
  candidate: RTCIceCandidateType
  uuid: string
}

export interface IMuteMicPayload extends IUUID {
  isMuted: boolean
}

export interface IMicMutedResponse extends IMuteMicPayload {}
