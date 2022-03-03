import type { ICurrentTrack, ISpotifyUserResponse } from '@/types/spotify'
import { createSlice } from '@reduxjs/toolkit'

interface IState {
  accessToken: string | null
  userInfo: ISpotifyUserResponse | null
  currentTrack: ICurrentTrack | null
}

const initialState: IState = {
  accessToken: null,
  userInfo: null,
  currentTrack: null,
}

interface IUpdateAccessTokenPayload {
  payload: string | null
}

interface IUpdateUserInfoPayload {
  payload: ISpotifyUserResponse | null
}

interface IUpdateCurrentTrackPayload {
  payload: ICurrentTrack | null
}

const spotifySlice = createSlice({
  name: 'spotify',
  initialState,
  reducers: {
    updateAccessToken: (state, { payload }: IUpdateAccessTokenPayload) => {
      state.accessToken = payload
    },
    updateUserInfo: (state, { payload }: IUpdateUserInfoPayload) => {
      state.userInfo = payload
    },
    updateCurrentTrack: (state, { payload }: IUpdateCurrentTrackPayload) => {
      state.currentTrack = payload
    },
    clear: state => {
      state.accessToken = null
      state.userInfo = null
      state.currentTrack = null
    },
  },
})

export const { clear, updateAccessToken, updateCurrentTrack, updateUserInfo } =
  spotifySlice.actions

export default spotifySlice.reducer
