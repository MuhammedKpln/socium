import React from 'react'
import { ActivityIndicator } from 'react-native'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import ApplicationNavigator from './navigators/ApplicationNavigator'
import { persistedStore, store } from './store'

export default () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistedStore} loading={<ActivityIndicator />}>
        <ApplicationNavigator />
      </PersistGate>
    </Provider>
  )
}
