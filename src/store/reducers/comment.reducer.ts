import { IComment } from '@/Types/comment.types'
import { createSlice } from '@reduxjs/toolkit'

interface IState {
  comments: IComment[]
}

interface IUpdateCommentsPayload {
  payload: {
    comments: IComment[]
  }
}

const initialState: IState = {
  comments: [],
}

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    updateComments: (state, { payload }: IUpdateCommentsPayload) => {
      state.comments = payload.comments
    },
  },
})

export const { updateComments } = commentSlice.actions

export default commentSlice.reducer
