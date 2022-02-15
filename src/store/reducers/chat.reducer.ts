import { createSlice } from '@reduxjs/toolkit'
import dayjs, { Dayjs } from 'dayjs'

interface IState {
  mic: boolean
  speakersOn: boolean
  callTimer: Dayjs
}

const initialState: IState = {
  mic: true,
  speakersOn: true,
  callTimer: dayjs(),
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    toggleMicMuted: state => {
      state.mic = !state.mic
    },
    toggleSpeakers: state => {
      state.speakersOn = !state.speakersOn
    },
    increaseCallTimer: state => {
      state.callTimer = state.callTimer.add(1, 'second')
    },
    resetChat(state) {
      state.mic = initialState.mic
      state.speakersOn = initialState.speakersOn
      state.callTimer = dayjs()
    },
  },
})

export const { toggleSpeakers, toggleMicMuted, resetChat, increaseCallTimer } =
  chatSlice.actions

export default chatSlice.reducer
