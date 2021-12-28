import { createSlice } from '@reduxjs/toolkit'
import { Colors } from 'react-native-ui-lib'

interface IState {
  theme: 'dark' | 'light' | 'default'
}

interface IUpdateThemePayload {
  payload: IState
}

const initialState: IState = {
  theme: 'default',
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    updateTheme: (state, { payload }: IUpdateThemePayload) => {
      state.theme = payload.theme

      Colors.setScheme(payload.theme)
    },
  },
})

export const { updateTheme } = themeSlice.actions

export default themeSlice.reducer
