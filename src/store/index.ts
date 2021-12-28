import {createStore} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import {storage} from '../storage';
import rootReducer from './reducers';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

let store = createStore(persistedReducer);
let persistedStore = persistStore(store);

export {store, persistedStore};
