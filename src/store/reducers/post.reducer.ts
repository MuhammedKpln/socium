import { IPost } from '@/Types/post.types'
import { createSlice } from '@reduxjs/toolkit'

interface IState {
  posts: IPost[]
}

interface ISetPostsPayload {
  payload: IPost[]
}

interface IPostLikePayload {
  payload: {
    post: IPost
  }
}

const initialState: IState = {
  posts: [],
}

const postReducer = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setPosts(state, { payload }: ISetPostsPayload) {
      state.posts = payload
    },
    updatePostUnLiked(state, { payload }: IPostLikePayload) {
      const index = state.posts.findIndex(v => v.id === payload.post.id)
      const _post = state.posts[index]

      _post.userLike.liked = false
      _post.postLike.likeCount = _post.postLike.likeCount - 1

      state.posts = [...state.posts]
    },
    updatePostLiked(state, { payload }: IPostLikePayload) {
      const index = state.posts.findIndex(v => v.id === payload.post.id)
      const _post = state.posts[index]

      _post.userLike = {
        liked: true,
      }
      _post.postLike.likeCount = _post.postLike.likeCount + 1

      state.posts = [...state.posts]
    },
  },
})

export const { setPosts, updatePostLiked, updatePostUnLiked } =
  postReducer.actions

export default postReducer.reducer
