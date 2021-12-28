import { InMemoryCache } from '@apollo/client'
import { offsetLimitPagination } from '@apollo/client/utilities'

export const apolloCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        feed: offsetLimitPagination(),
      },
    },
  },
})
