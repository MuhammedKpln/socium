import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  from,
  fromPromise,
  split,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { getMainDefinition } from '@apollo/client/utilities'
import React from 'react'
import { ActivityIndicator } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { Config } from './config'
import ApplicationNavigator from './navigators/ApplicationNavigator'
import { getNewToken } from './services/token.service'
import { EncryptedStorageKeys, storage } from './storage'
import { persistedStore, store } from './store'
import { logout } from './store/reducers/user.reducer'
import { initApolloCache, WebSocketLink } from './utils/apollo'
import { showToast, ToastStatus } from './utils/toast'

const httpLink = createHttpLink({
  uri: Config.API_URL + '/graphql',
})

let isRefreshing = false
let pendingRequests: Function[] = []

const resolvePendingRequests = () => {
  pendingRequests.map(callback => callback())
  pendingRequests = []
}

const errorLink = onError(
  ({ graphQLErrors, networkError, forward, operation }) => {
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        console.error(err.message)
        // error code is set to UNAUTHENTICATED
        // when AuthenticationError thrown in resolver
        let forward$

        if (err.message == 'Refresh token mismatch') {
          store.dispatch(logout())
          showToast(
            ToastStatus.Error,
            'Oturumunuz sona erdi. Lütfen tekrar giriş yapınız.',
          )
        }

        if (
          //@ts-ignore
          err.extensions?.exception?.name === 'TokenExpiredError' ||
          err.message === 'JWT_EXPIRED'
        ) {
          if (!isRefreshing) {
            isRefreshing = true
            forward$ = fromPromise(
              getNewToken()
                .then(({ token }) => {
                  // Store the new tokens for your auth link
                  resolvePendingRequests()
                  return token
                })
                .catch(() => {
                  pendingRequests = []
                  // Handle token refresh errors e.g clear stored tokens, redirect to login, ...
                  return
                })
                .finally(() => {
                  isRefreshing = false
                }),
            ).filter(value => Boolean(value))
          } else {
            // Will only emit once the Promise is resolved
            forward$ = fromPromise(
              new Promise(resolve => {
                pendingRequests.push(resolve)
              }),
            )
          }

          return forward$.flatMap(() => forward(operation))
        }
      }
    }
    if (networkError) {
      console.error(networkError)
    }
  },
)

const websocketLink = new WebSocketLink({
  url: Config.GRAPHQL_WS_URL,
  connectionParams: async () => {
    const authToken = await storage.getStringAsync(
      EncryptedStorageKeys.AccessToken,
    )

    return {
      authToken,
    }
  },
  lazy: true,
})

const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  let token = await storage.getStringAsync(EncryptedStorageKeys.AccessToken)

  if (_.operationName === 'REFRESH_TOKEN') {
    return {
      headers: {},
    }
  }

  if (token) {
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${token}`,
      },
    }
  } else {
    return {
      headers,
    }
  }
})

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  websocketLink,
  httpLink,
)

const cache = initApolloCache()

export const client = new ApolloClient({
  cache,
  connectToDevTools: false,
  link: from([errorLink, authLink, splitLink]),
})

export default () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistedStore} loading={<ActivityIndicator />}>
        <ApolloProvider client={client}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <ApplicationNavigator />
          </GestureHandlerRootView>
        </ApolloProvider>
      </PersistGate>
    </Provider>
  )
}
