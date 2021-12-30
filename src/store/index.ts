import { useSelector } from 'react-redux'
import { createStore } from 'redux'
import { persistReducer, persistStore } from 'redux-persist'
import { storage } from '../storage'
import rootReducer from './reducers'

const persistConfig = {
  key: 'root',
  blacklist: ['comments', 'theme'],
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

let store = createStore(persistedReducer)
let persistedStore = persistStore(store)

export type RootState = ReturnType<typeof rootReducer>
export const useAppSelector = <TState = RootState, TSelected = unknown>(
  selector: (state: TState) => TSelected,
  equalityFn?: (left: TSelected, right: TSelected) => boolean,
): TSelected => useSelector(selector, equalityFn)

export { store, persistedStore }
