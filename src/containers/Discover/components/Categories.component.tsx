import { Surface } from '@/components/Surface/Surface.component'
import {
  IListCategoriesResponse,
  LIST_ALL_CATEGORIES,
} from '@/graphql/queries/Categories.query'
import { ICategory } from '@/Types/post.types'
import { useQuery } from '@apollo/client'
import React, { useCallback } from 'react'
import { FlatList } from 'react-native'
import { Text, TouchableOpacity } from 'react-native-ui-lib'

export function Categories() {
  const { data } = useQuery<IListCategoriesResponse>(LIST_ALL_CATEGORIES)

  const renderItem = useCallback(({ item }: { item: ICategory }) => {
    return (
      <TouchableOpacity>
        <Surface marginR-10 height={35} padding-10 br100>
          <Text center textColor>
            {item.name}
          </Text>
        </Surface>
      </TouchableOpacity>
    )
  }, [])

  return (
    <FlatList
      renderItem={renderItem}
      data={data?.categories}
      horizontal
      style={{ maxHeight: 35 }}
    />
  )
}
