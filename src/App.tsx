import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  from,
  fromPromise,
  split,
} from '@apollo/client'
import React from 'react'
import { ActivityIndicator } from 'react-native'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { Config } from './config'
import ApplicationNavigator from './navigators/ApplicationNavigator'
import { persistedStore, store } from './store'
import { onError } from '@apollo/client/link/error'
import { setContext } from '@apollo/client/link/context'
import { EncryptedStorageKeys, storage } from './storage'
import { getMainDefinition } from '@apollo/client/utilities'
import { apolloCache, WebSocketLink } from './utils/apollo'
import { getNewToken } from './services/token.service'

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
        console.error(err)
        //@ts-ignore
        console.warn('calisiyrum')
        // error code is set to UNAUTHENTICATED
        // when AuthenticationError thrown in resolver
        let forward$

        if (
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

export const client = new ApolloClient({
  cache: apolloCache,
  connectToDevTools: false,
  link: from([errorLink, authLink, splitLink]),
})

export default () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistedStore} loading={<ActivityIndicator />}>
        <ApolloProvider client={client}>
          <ApplicationNavigator />
        </ApolloProvider>
      </PersistGate>
    </Provider>
  )
}
