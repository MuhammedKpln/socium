import { Config } from '@/config'
import { EventEmitter } from 'events'
import {
  RTCIceCandidateType,
  RTCSessionDescriptionType,
} from 'react-native-webrtc'
import {
  IAnswerMadeResponse,
  ICallMadeResponse,
  IClientPairedData,
  IIceCandidateReceived,
  IJoinQueueArgs,
  IJoinRoomArg,
  IMessageReceivedData,
  IMessageRemoved,
  IMicMutedResponse,
  IMuteMicPayload,
  ISendMessageArg,
  IUserIsTyping,
  SocketFireEvents,
  SocketListenerEvents,
} from './socket.types'
import ReconnectingWebSocket from 'reconnecting-websocket'

export class SocketConnection {
  io: ReconnectingWebSocket
  roomName: string = ''
  isTyping: boolean = false
  eventListener: any
  events: EventEmitter = new EventEmitter()

  constructor() {
    // const token = storage.getString(EncryptedStorageKeys.AccessToken)
    this.io = new ReconnectingWebSocket(Config.SOCKET_URL)
    this.listenForEvents()
  }

  private listenForEvents() {
    this.eventListener = this.io.addEventListener('message', message => {
      try {
        console.log(message)
        const parsedMessage = JSON.parse(message.data)
        const event: string = parsedMessage.event

        this.events.emit(event, parsedMessage.data)
      } catch (err) {
        console.error('WW', err)
      }
    })
  }

  private emit(event: string, data?: any) {
    const eventPacket = {
      event,
      data: { ...data },
    }
    this.io.send(JSON.stringify(eventPacket))
  }

  private on(event: string, callback: (data?: any) => void) {
    this.events.on(event, callback)
  }

  joinQueue({ user }: IJoinQueueArgs) {
    this.emit(SocketFireEvents.JoinQueue, { user })
  }

  joinRoom({ room }: IJoinRoomArg) {
    this.emit(SocketFireEvents.JoinRoom, { room })
  }

  sendMessage(message: ISendMessageArg) {
    this.emit(SocketFireEvents.SendMessage, message)
  }

  typing(typing: boolean, room: string) {
    this.emit(SocketFireEvents.Typing, { typing, room })
  }

  leaveQueue() {
    this.emit(SocketFireEvents.LeaveQueue)
  }

  removeMessage(messageId: number, room: string) {
    this.emit(SocketFireEvents.RemoveMessageRequest, { messageId, room })
  }

  callUser(offer: RTCSessionDescriptionType, uuid: string) {
    this.emit(SocketFireEvents.CallUser, { offer, uuid })
  }

  makeAnswer(answer: RTCSessionDescriptionType, clientId: string) {
    this.emit(SocketFireEvents.MakeAnswer, {
      answer,
      uuid: clientId,
    })
  }

  muteMic(payload: IMuteMicPayload) {
    this.emit(SocketFireEvents.MuteMic, payload)
  }

  clientPairedEvent(callback: (data: IClientPairedData) => void) {
    this.on(SocketListenerEvents.ClientPaired, callback)
  }

  addIceCandidate(candidate: RTCIceCandidateType, uuid: string) {
    this.emit(SocketFireEvents.AddIceCandidate, {
      candidate,
      uuid,
    })
  }

  retrieveCall(uuid: string) {
    this.emit(SocketFireEvents.RetrieveCall, {
      uuid,
    })
  }

  iceCandidateReceivedEvent(callback: (data: IIceCandidateReceived) => void) {
    this.on(SocketListenerEvents.ReceivedIceCandidate, callback)
  }

  messageReceivedEvent(callback: (data: IMessageReceivedData) => void) {
    this.on(SocketListenerEvents.MessageReceived, callback)
  }

  userIsTypingEvent(callback: (data: IUserIsTyping) => void) {
    this.on(SocketListenerEvents.Typing, callback)
  }

  userIsDoneTypingEvent(callback: (data: IUserIsTyping) => void) {
    this.on(SocketListenerEvents.DoneTyping, callback)
  }

  messageRemovedEvent(callback: (data: IMessageRemoved) => void) {
    this.on(SocketListenerEvents.RemoveMessageRequested, callback)
  }

  callMadeEvent(callback: (data: ICallMadeResponse) => void) {
    this.on(SocketListenerEvents.CallMade, callback)
  }

  answerMadeEvent(callback: (data: IAnswerMadeResponse) => void) {
    this.on(SocketListenerEvents.AnswerMade, callback)
  }

  callRetrievedEvent(callback: () => void) {
    this.on(SocketListenerEvents.CallIsRetrieved, callback)
  }

  micMutedEvent(callback: (muted: IMicMutedResponse) => void) {
    this.on(SocketListenerEvents.MicMuted, callback)
  }

  close() {
    return this.io.close()
  }

  removeListeners(events?: SocketListenerEvents[]) {
    this.io.removeEventListener('message', this.eventListener)

    if (events) {
      events.forEach(event => {
        this.events.removeAllListeners(event)
      })
    } else {
      this.events.removeAllListeners()
    }
  }
}
