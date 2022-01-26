import { IComment } from '@/Types/comment.types'
import { createSlice } from '@reduxjs/toolkit'

interface IState {
  isAnsweringParent: number | null
  comments: IComment[]
}

interface IUpdateAnsweringPayload {
  payload: number | null
}
interface IUpdateCommentsPayload {
  payload: IComment[]
}
interface IPushNewCommentPayload {
  payload: IComment
}
interface IUpdateParentCommentsPayload {
  payload: {
    parentId: number
    comment: IComment
  }
}
const initialState: IState = {
  isAnsweringParent: null,
  comments: [],
}

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    updateAnsweringParent: (state, { payload }: IUpdateAnsweringPayload) => {
      console.log(state.isAnsweringParent, payload)
      state.isAnsweringParent = payload
    },

    updateComments: (state, { payload }: IUpdateCommentsPayload) => {
      state.comments = payload
    },
    pushNewComment: (state, { payload }: IPushNewCommentPayload) => {
      state.comments = state.comments.concat(payload)
    },
    updateParentComments: (
      state,
      { payload }: IUpdateParentCommentsPayload,
    ) => {
      const comments = state.comments.map(comment => {
        if (comment.id === payload.parentId) {
          comment.parentComments.push(payload.comment)
        }

        return comment
      })

      state.comments = comments
    },
  },
})

export const {
  updateAnsweringParent,
  updateComments,
  updateParentComments,
  pushNewComment,
} = commentSlice.actions

export default commentSlice.reducer
