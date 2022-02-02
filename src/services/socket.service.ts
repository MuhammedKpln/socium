import { Config } from '@/config'
import {
  IClientPairedData,
  IJoinQueueArgs,
  IJoinRoomArg,
  IMessageReceivedData,
  IMessageRemoved,
  ISendMessageArg,
  IUserIsTyping,
  SocketFireEvents,
  SocketListenerEvents,
} from './socket.types'

export class SocketConnection {
  io: WebSocket
  roomName: string = ''
  isTyping: boolean = false
  eventListener: any

  constructor() {
    // const token = storage.getString(EncryptedStorageKeys.AccessToken)
    this.io = new WebSocket(Config.SOCKET_URL)
  }

  async connect() {
    return new Promise((resolve, reject) => {
      try {
        this.io = new WebSocket(Config.SOCKET_URL)
        resolve(true)
      } catch (error) {
        reject(error)
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
    this.eventListener = this.io.addEventListener('message', message => {
      {
        try {
          console.log(message)
          const parsedMessage = JSON.parse(message.data)

          if (parsedMessage.event === event) {
            callback(parsedMessage?.data)
          }
        } catch (err) {
          console.error(err)
        }
      }
    })
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

  removeMessage(messageId: number, room: string) {
    this.emit(SocketFireEvents.RemoveMessageRequest, { messageId, room })
  }

  clientPairedEvent(callback: (data: IClientPairedData) => void) {
    this.on(SocketListenerEvents.ClientPaired, callback)
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

  close() {
    return this.io.close()
  }

  removeListeners() {
    this.io.removeEventListener('message', this.eventListener)
  }
}
