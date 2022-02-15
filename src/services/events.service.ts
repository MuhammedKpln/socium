import { EventEmitter } from 'events'
import TypedEmitter from 'typed-emitter'
import { ICallMadeResponse } from './socket.types'

type ChatEvents = {
  micMuted: (isMuted: boolean) => void
  callAccepted: (payload: ICallMadeResponse) => void
  callRejected: () => void
  callRetrieved: () => void
  callIsRetrieved: () => void
  callAcceptedCloseCallingModal: () => void
  micToggled: () => void
  speakerToggled: () => void
  callEnded: () => void
}

export const chatEmitter = new EventEmitter() as TypedEmitter<ChatEvents>
