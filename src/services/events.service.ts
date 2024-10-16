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
  cleanTextInputValue: () => void
  textInputValue: (value: string) => void
}

export const chatEmitter = new EventEmitter() as TypedEmitter<ChatEvents>

type MatchEvents = {
  acceptMatch: () => void
  rejectMatch: () => void
}

export const matchEmitter = new EventEmitter() as TypedEmitter<MatchEvents>
