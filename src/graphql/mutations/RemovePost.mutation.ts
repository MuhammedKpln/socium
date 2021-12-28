import { gql } from '@apollo/client'

export const REMOVE_POST = gql`
  mutation REMOVE_POST($postId: Float!) {
    removePost(postId: $postId)
  }
`
