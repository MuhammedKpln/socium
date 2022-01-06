import { IComment } from '@/Types/comment.types'
import gql from 'graphql-tag'

export interface IFetchCommentsVariables {
  postId: number
  offset?: number
  limit?: number
}

export interface IFetchCommentsResponse {
  getPostComments: IComment[]
}

export const FETCH_COMMENTS = gql`
  query FETCH_POST_COMMENTS(
    $postId: Float!
    $offset: Float = 0
    $limit: Float = 10
  ) {
    getPostComments(
      postId: $postId
      pagination: { offset: $offset, limit: $limit }
    ) {
      id
      content
      user {
        id
        bio
        username
      }
      userLike {
        liked
      }
      postLike {
        likeCount
      }
      parentUser {
        userParentComments {
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
          }
        }
      }
    }
  }
`
