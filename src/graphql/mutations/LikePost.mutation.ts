import { IPostLike } from '@/types/post.types'
import { gql } from '@apollo/client'

export interface ILikeCommentVariables {
  commentId: number
}

export interface ILikeCommentResponse {
  likeEntry: IPostLike
}

export interface IUnlikeCommentVariables {
  commentId: number
}

export interface IUnlikeCommentResponse {
  unlikeEntry: IPostLike
}

export const LIKE_COMMENT = gql`
  mutation LIKE_COMMENT($commentId: Float!) {
    likeEntry(data: { comment: $commentId }) {
      likeCount
      userLike {
        liked
      }
    }
  }
`

export const UNLIKE_COMMENT = gql`
  mutation UNLIKE_COMMENT($commentId: Float!) {
    unlikeEntry(data: { comment: $commentId }) {
      likeCount
      userLike {
        liked
      }
    }
  }
`

export const LIKE_POST = gql`
  mutation LIKE_POST($postId: Float!) {
    likeEntry(data: { post: $postId }) {
      likeCount
      userLike {
        liked
      }
    }
  }
`

export const UNLIKE_POST = gql`
  mutation UNLIKE_POST($postId: Float!) {
    unlikeEntry(data: { post: $postId }) {
      likeCount
      userLike {
        liked
      }
    }
  }
`
