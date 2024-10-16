import { IPost } from '@/Types/post.types'
import { gql } from '@apollo/client'

export interface IFetchMostLikedPostsVariables {
  limit?: number
  offset?: number
}

export interface IFetchMostLikedPostsResponse {
  mostLikedPosts: IPost[]
}

export const FETCH_MOST_LIKED_POSTS = gql`
  query FETCH_MOST_LIKED_POSTS($limit: Float! = 15, $offset: Float! = 0) {
    mostLikedPosts(pagination: { limit: $limit, offset: $offset }) {
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
