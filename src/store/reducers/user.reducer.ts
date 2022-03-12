import { client } from '@/App'
import {
  FETCH_USER_STARS,
  IFetchUserStarsResponse,
} from '@/graphql/queries/User.query'
import { EncryptedStorageKeys, storage } from '@/storage'
import type { IUser } from '@/Types/login.types'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface IState {
  user: IUser | null
  isLoggedIn: boolean
  starCount?: number
  showNextAd?: Date | null
}

interface IUpdateLoginStatusPayload {
  payload: IState
}

interface IUpdateUserPayload {
  payload: IUser
}
interface IUpdateStarCountPayload {
  payload: number
}

interface IUpdateShowNextAdPayload {
  payload: Date
}

const initalState: IState = {
  user: null,
  isLoggedIn: false,
  starCount: 0,
  showNextAd: null,
}

export const fetchUserStars = createAsyncThunk(
  'user/fetchUserStars',
  async () => {
    const {
      data: { getUserStars },
    } = await client.query<IFetchUserStarsResponse>({
      query: FETCH_USER_STARS,
    })

    return getUserStars
  },
)

const userSlice = createSlice({
  name: 'user',
  initialState: initalState,
  reducers: {
    updateLoginStatus: (
      state,
      { payload: { user, isLoggedIn } }: IUpdateLoginStatusPayload,
    ) => {
      state.isLoggedIn = isLoggedIn
      state.user = user
    },
    updateUser: (state, { payload }: IUpdateUserPayload) => {
      state.user = { ...state.user, ...payload }
    },
    updateStarCount: (state, { payload }: IUpdateStarCountPayload) => {
      state.starCount = payload
    },
    updateShowNextAd: (state, { payload }: IUpdateShowNextAdPayload) => {
      state.showNextAd = payload
    },
    logout(state) {
      state.isLoggedIn = false
      state.user = null

      client.clearStore()
      storage.removeItem(EncryptedStorageKeys.FcmToken)
      storage.removeItem(EncryptedStorageKeys.AccessToken)
      storage.removeItem(EncryptedStorageKeys.AccessTokenExpireDate)
      storage.removeItem(EncryptedStorageKeys.RefreshToken)
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchUserStars.fulfilled, (state, { payload }) => {
      state.starCount = payload.starCount
    })
  },
})

export const {
  logout,
  updateLoginStatus,
  updateUser,
  updateShowNextAd,
  updateStarCount,
} = userSlice.actions
export default userSlice.reducer
