import { ERROR_CODES_RAW } from '@/types/error_codes'
import {
  ApolloError,
  ApolloLink,
  FetchResult,
  InMemoryCache,
  Observable,
  Operation,
} from '@apollo/client'
import { concatPagination } from '@apollo/client/utilities'
import { GraphQLError, print } from 'graphql'
import { Client, ClientOptions, createClient } from 'graphql-ws'

export const apolloCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        postsWithoutBlog: concatPagination(),
        posts: concatPagination(),
        messagesFromRoom: concatPagination(),
      },
    },
  },
})

export class WebSocketLink extends ApolloLink {
  private client: Client

  constructor(options: ClientOptions) {
    super()
    this.client = createClient(options)
  }

  public request(operation: Operation): Observable<FetchResult> {
    return new Observable(sink => {
      return this.client.subscribe<FetchResult>(
        { ...operation, query: print(operation.query) },
        {
          next: sink.next.bind(sink),
          complete: sink.complete.bind(sink),
          error: err => {
            console.log(err)
            if (err instanceof Error) {
              return sink.error(err)
            }

            return sink.error(
              new Error(
                (err as GraphQLError[])
                  .map(({ message }) => message)
                  .join(', '),
              ),
            )
          },
        },
      )
    })
  }
}

export const handleApolloErrors = (
  error: ApolloError,
  error_code: ERROR_CODES_RAW,
): number | null => {
  for (let i = 0; i < error.graphQLErrors.length; i++) {
    const err = error.graphQLErrors[i]
    if (err.extensions.error_code === error_code) {
      return err.extensions.error_code
    }
  }

  return null
}
