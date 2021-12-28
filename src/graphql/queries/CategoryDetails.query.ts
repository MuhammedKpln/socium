import { ICategory } from '@/Types/post.types'
import { gql } from '@apollo/client'

export interface IFetchCategoryDetailsVariables {
  categoryId: number
}

export interface IFetchCategoryDetailsResponse {
  category: ICategory
}

export const FETCH_CATEGORY_DETAILS = gql`
  query FETCH_CATEGORY_DETAILS($categoryId: Float!) {
    category(id: $categoryId) {
      name
      image
      description
    }
  }
`
