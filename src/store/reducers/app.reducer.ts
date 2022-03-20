import { avatarStatic } from '@/utils/static'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { InteractionManager } from 'react-native'
import FastImage, { Source } from 'react-native-fast-image'

interface IState {
  firstStart: boolean
  notifications: boolean
}

const initialState: IState = {
  firstStart: true,
  notifications: true,
}

export const fetchAvatars = createAsyncThunk(
  'app/fetchAvatars',
  async (_, { getState }) => {
    InteractionManager.runAfterInteractions(async () => {
      //@ts-ignore
      const isFirstStart = getState()?.appReducer?.firstStart

      if (isFirstStart) {
        const images: Source[] = []

        for (let index = 1; index < 54; index++) {
          const avatar = `avatar${index}`
          const avatarUrl = avatarStatic(avatar)
          images.push({
            uri: avatarUrl,
            priority: FastImage.priority.low,
          })
        }

        FastImage.preload(images)
      }
    })
  },
)

const appSlice = createSlice({
  initialState,
  name: 'app',
  reducers: {
    toggleNotifications: state => {
      if (state.notifications) {
        state.notifications = false
      } else {
        state.notifications = true
      }
    },
    setFirstStart: (state, payload) => {
      state.firstStart = payload.payload
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchAvatars.fulfilled, state => {
      state.firstStart = false
    })
  },
})

export const { toggleNotifications, setFirstStart } = appSlice.actions

export default appSlice.reducer
