import { IComment } from '@/Types/comment.types'
import { gql } from '@apollo/client'

export interface INewCommentVariables {
  postId?: number
  parentId?: number
  content: string
}

export interface INewCommentResponse {
  newComment: IComment
}

export const NEW_COMMENT = gql`
  mutation NEW_COMMENT($postId: Float, $content: String!, $parentId: Float) {
    newComment(
      postId: $postId
      parentId: $parentId
      data: { content: $content }
    ) {
      id
      content
      user {
        id
        bio
        username
        avatar
      }
      userLike {
        liked
      }
      postLike {
        likeCount
      }
      parentComments {
        id
        content
        created_at

        postLike {
          likeCount
        }
        user {
          id
          bio
          username
          avatar
        }
      }
    }
  }
`

export const REMOVE_COMMENT = gql`
  mutation REMOVE_COMMENT($commentId: Float!) {
    removeComment(commentId: $commentId)
  }
`
