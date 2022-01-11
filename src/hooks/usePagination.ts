import { ApolloQueryResult, FetchMoreQueryOptions } from '@apollo/client'
import { useCallback } from 'react'

export interface IUsePaginationArgs<TVariables, TData> {
  fetchMore: (
    fetchMoreOptions: FetchMoreQueryOptions<TVariables, TData>,
  ) => Promise<ApolloQueryResult<TData>>
}
export interface IUsePaginationFetchMoreDataArgs<TVariables> {
  offset: number
  additionalVariables: Partial<TVariables>
}

export function usePagination<TVariables, TData>(
  args: IUsePaginationArgs<TVariables, TData>,
) {
  const { fetchMore } = args

  const fetchMoreData = useCallback(
    ({
      offset,
      additionalVariables,
    }: IUsePaginationFetchMoreDataArgs<TVariables>) => {
      fetchMore({
        variables: {
          limit: 15,
          offset,
          ...additionalVariables,
        },
      })
    },
    [fetchMore],
  )

  return {
    fetchMoreData,
  }
}
