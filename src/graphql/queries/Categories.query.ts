import { ICategory } from '@/Types/post.types'
import { gql } from '@apollo/client'

export interface IListCategoriesResponse {
  categories: ICategory[]
}

export const LIST_ALL_CATEGORIES = gql`
  query LIST_ALL_CATEGORIES {
    categories {
      id
      name
      image
      description
    }
  }
`
