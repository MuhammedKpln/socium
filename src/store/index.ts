import { useSelector } from 'react-redux'
import { createStore } from 'redux'
import { persistReducer, persistStore } from 'redux-persist'
import { storage } from '../storage'
import rootReducer from './reducers'
import thunkMiddleware from 'redux-thunk'
import { applyMiddleware } from '@reduxjs/toolkit'

const persistConfig = {
  key: 'root',
  blacklist: ['comments', 'theme', 'post'],
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const composedEnhancer = applyMiddleware(thunkMiddleware)

let store = createStore(persistedReducer, composedEnhancer)
let persistedStore = persistStore(store)

export type RootState = ReturnType<typeof rootReducer>
export const useAppSelector = <TState = RootState, TSelected = unknown>(
  selector: (state: TState) => TSelected,
  equalityFn?: (left: TSelected, right: TSelected) => boolean,
): TSelected => useSelector(selector, equalityFn)

export { store, persistedStore }
