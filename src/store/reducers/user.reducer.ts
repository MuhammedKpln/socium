import { client } from '@/App'
import { EncryptedStorageKeys, storage } from '@/storage'
import { IUser } from '@/Types/login.types'
import { createSlice } from '@reduxjs/toolkit'

interface IState {
  user: IUser | null
  isLoggedIn: boolean
}

interface IUpdateLoginStatusPayload {
  payload: IState
}

const initalState: IState = {
  user: null,
  isLoggedIn: false,
}

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
})

export const { logout, updateLoginStatus } = userSlice.actions
export default userSlice.reducer
