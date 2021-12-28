import { useSelector } from 'react-redux'
import { createStore } from 'redux'
import { persistReducer, persistStore } from 'redux-persist'
import { storage } from '../storage'
import rootReducer from './reducers'

const persistConfig = {
  key: 'root',
  whitelist: ['comments', 'theme'],
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

let store = createStore(persistedReducer)
let persistedStore = persistStore(store)

export type RootState = ReturnType<typeof rootReducer>
export const useAppSelector = (
  selector: (state: RootState) => unknown,
  equalityFn?: (left: unknown, right: unknown) => boolean,
) => useSelector<RootState>(selector, equalityFn)

export { store, persistedStore }
