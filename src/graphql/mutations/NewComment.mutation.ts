import { gql } from '@apollo/client'

export const NEW_COMMENT = gql`
  mutation NEW_COMMENT($postId: Float!, $content: String!) {
    newComment(postId: $postId, data: { content: $content }) {
      id
      content
      user {
        bio
        username
      }
    }
  }
`

export const REMOVE_COMMENT = gql`
  mutation REMOVE_COMMENT($commentId: Float!) {
    removeComment(commentId: $commentId)
  }
`
