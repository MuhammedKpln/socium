import { gql } from '@apollo/client'

export const CREATE_POST = gql`
  mutation NEW_POST(
    $title: String!
    $content: String!
    $type: Float!
    $categoryId: Float!
  ) {
    createPost(
      post: {
        content: $content
        type: $type
        categoryId: $categoryId
        title: $title
      }
    ) {
      id
    }
  }
`
