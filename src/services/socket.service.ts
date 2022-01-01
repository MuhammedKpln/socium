import { Config } from '@/config'
import { EncryptedStorageKeys, storage } from '@/storage'
import { IUser } from '@/Types/login.types'
import { RTCSessionDescriptionType } from 'react-native-webrtc'
import S, { Socket } from 'socket.io-client'
import {
  IAnswerMadeResponse,
  ICallMadeResponse,
  IClientPairedData,
  IHangUpResponse,
  IJoinRoomArg,
  IRemoveMessageRequested,
  ISeenStatusUpdated,
  ISendMessageResponse,
  ITypingResponse,
  IUpdateSeenStatus,
  JoinRole,
  SocketFireEvents,
  SocketListenerEvents,
} from './socket.types'

export class SocketConnection {
  io: Socket
  clientId: string = ''
  roomName: string = ''

  constructor() {
    const token = storage.getString(EncryptedStorageKeys.AccessToken)

    this.io = S(Config.SOCKET_URL, {
      secure: true,
      autoConnect: true,
      transports: ['websocket', 'polling'],
      rememberUpgrade: true,
      extraHeaders: {
        Authorization: 'Bearer ' + token,
      },
    })
  }

  connect() {
    if (this.io.connected) return

    this.io.connect()
  }

  disconnect() {
    this.io.disconnect()
    this.roomName = ''
    this.clientId = ''
  }

  userConnectedEvent(callback: () => void) {
    this.io.on('connect', callback)
  }

  userConnected(user: IUser) {
    this.io.emit('user connected', {
      user: user,
    })
  }

  checkIfUserIsConnected(userId: number) {
    this.io.emit(SocketFireEvents.CheckIfUserIsConnected, { userId })
  }

  listenUserIsOnline(callback: (status: boolean) => void) {
    this.io.once(SocketListenerEvents.UserIsOnline, data => {
      callback(data.status)
    })
  }

  listenAbuseDetected(callback: () => void) {
    this.io.on(SocketListenerEvents.AbuseDetected, () => {
      callback()
    })
  }

  clientPairedEvent(callback: (data: IClientPairedData) => void) {
    this.io.on(SocketListenerEvents.ClientPaired, (data: IClientPairedData) => {
      this.clientId = data.clientId
      this.roomName = data.roomName

      callback(data)
    })
  }

  listenMessages(callback: (message: ISendMessageResponse) => void) {
    this.io.on(SocketListenerEvents.Messages, (data: ISendMessageResponse) => {
      callback(data)
    })
  }

  listenClientDisconnected(callback: () => void) {
    this.io.on(SocketListenerEvents.ClientDisconnected, () => {
      callback()
    })
  }

  listenCallIsCloseRequest(callback: () => void) {
    this.io.once(SocketListenerEvents.CallIsRetrieved, callback)
  }

  listenSeenStatusUptades(callback: (data: ISeenStatusUpdated) => void) {
    this.io.on(SocketListenerEvents.SeenStatusUpdated, callback)
  }

  listenAnswerMade(callback: (data: IAnswerMadeResponse) => void) {
    this.io.on(SocketListenerEvents.AnswerMade, (data: IAnswerMadeResponse) => {
      callback(data)
    })
  }

  listenOnlineUsersCount(callback: () => void) {
    this.io.on('online users', callback)
  }

  getOnlineUsersCount() {
    this.io.emit('get online users count')
  }

  listenRemoveMessageRequested(
    callback: (data: IRemoveMessageRequested) => void,
  ) {
    this.io.on(
      SocketListenerEvents.RemoveMessageRequested,
      (data: IRemoveMessageRequested) => {
        callback(data)
      },
    )
  }

  listenCallMade(callback: (data: ICallMadeResponse) => void) {
    this.io.on(SocketListenerEvents.CallMade, (data: ICallMadeResponse) => {
      callback(data)
    })
  }

  listenHangupCall(callback: (data: IHangUpResponse) => void) {
    this.io.once(SocketListenerEvents.HangedUpCall, data => {
      callback(data)
    })
  }

  retrieveCall(clientId: string) {
    this.io.emit(SocketFireEvents.CallCloseRequest, {
      to: clientId,
    })
  }

  makeAnswer(answer: RTCSessionDescriptionType, clientId: string) {
    this.io.emit(SocketFireEvents.MakeAnswer, {
      answer,
      to: clientId,
    })
  }

  joinQueue(data: { role: JoinRole }) {
    this.io.emit(SocketFireEvents.JoinQueue, data)
  }

  joinRoom(data: IJoinRoomArg) {
    this.io.emit(SocketFireEvents.JoinRoom, data)
  }

  callUser(offer: RTCSessionDescriptionType, clientId: string) {
    this.io.emit(SocketFireEvents.CallUser, {
      offer,
      to: clientId,
    })
  }

  closeCall() {
    this.io.emit(SocketFireEvents.HangUpCall, { to: this.clientId })
  }

  leaveRoom() {
    this.io.emit(SocketFireEvents.LeaveRoom, {
      roomName: this.roomName,
    })
  }

  leaveQueue() {
    this.io.emit(SocketFireEvents.LeaveQueue)
  }

  typing(typing: boolean, roomAdress: string) {
    this.io.emit(SocketFireEvents.Typing, { typing, roomAdress })
  }

  sendMessage(message: string, user: IUser, receiver: IUser) {
    this.io.emit(SocketFireEvents.SendMessage, {
      roomName: this.roomName,
      firstJoined: false,
      message,
      user,
      receiver,
    })
  }

  listenActorIsTyping(callback: (typing: ITypingResponse) => void) {
    this.io.on(SocketListenerEvents.ActorIsTyping, callback)
  }

  removeMessage(messageId: number) {
    this.io.emit(SocketFireEvents.RemoveMessageRequest, {
      messageId,
    })
  }

  updateSeenStatus(data: IUpdateSeenStatus) {
    this.io.emit(SocketFireEvents.UpdateSeenStatus, data)
  }

  close() {
    return this.io.disconnect()
  }

  removeAllListeners(listeners?: string[]) {
    if (listeners) {
      listeners.forEach(listener => {
        this.io.off(listener)
      })

      return
    }

    this.io.off()

    //@ts-ignore
    // return this.io.removeAllListeners(listeners || undefined)
  }
}

export default new SocketConnection()
