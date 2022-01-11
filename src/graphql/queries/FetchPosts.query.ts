import { IPost } from '@/types/post.types'
import { gql } from '@apollo/client'

export interface IFetchPostsVariables {
  limit?: number
  offset?: number
}

export interface IFetchPostsResponse {
  posts: IPost[]
}

export const FETCH_POSTS = gql`
  query FETCH_POSTS($limit: Float = 15, $offset: Float = 0) {
    posts(pagination: { limit: $limit, offset: $offset }) {
      id
      title
      content
      type
      slug
      created_at
      postFromFollowers
      userLike {
        liked
      }
      postLike {
        likeCount
      }
      updated_at

      user {
        username
        avatar
        id
      }
      _count {
        comment
      }

      category {
        id
        name
      }
    }
  }
`
