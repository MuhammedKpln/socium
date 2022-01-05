import { combineReducers } from '@reduxjs/toolkit'
import commentReducer from './comment.reducer'
import counterSlice from './counter.reducer'
import themeReducer from './theme.reducer'
import userReducer from './user.reducer'
import featureHightlightReducer from './featureHighlight.reducer'
import postReducer from './post.reducer'

export default combineReducers({
  counterSlice,
  userReducer,
  commentReducer,
  themeReducer,
  featureHightlightReducer,
  postReducer,
})
