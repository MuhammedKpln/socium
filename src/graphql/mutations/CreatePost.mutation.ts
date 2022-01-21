import { IPost, PostType } from '@/types/post.types'
import { gql } from '@apollo/client'

export interface ICreatePostResponse {
  createPost: IPost
}

export interface ICreatePostVariables {
  content: string
  type: PostType
  categoryId: number
  additional: string
}

export const CREATE_POST = gql`
  mutation NEW_POST(
    $content: String!
    $type: Float!
    $categoryId: Float!
    $additional: String
  ) {
    createPost(
      post: {
        content: $content
        type: $type
        categoryId: $categoryId
        additional: $additional
      }
    ) {
      id
    }
  }
`
