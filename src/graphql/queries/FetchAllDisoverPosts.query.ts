import { IPost } from '@/types/post.types'
import { gql } from '@apollo/client'

export interface IFetchallDiscoverPostsResponse {
  postsWithoutBlog: IPost[]
}
export interface IFetchallDiscoverPostsVariables {
  limit?: number
  offset?: number
}

export const FETCH_ALL_DISCOVER_POSTS = gql`
  query FETCH_ALL_DISCOVER_POSTS($limit: Float! = 15, $offset: Float! = 0) {
    postsWithoutBlog(pagination: { limit: $limit, offset: $offset }) {
      id

      content
      type
      _count {
        comment
      }
      postLike {
        likeCount
      }

      userLike {
        liked
      }

      user {
        id
        username
        avatar
      }
      created_at
    }
  }
`
export const FETCH_ALL_DISCOVER_BLOG_POSTS = gql`
  query FETCH_ALL_DISCOVER_POSTS($limit: Float! = 15, $offset: Float! = 0) {
    postsOnlyBlog(pagination: { limit: $limit, offset: $offset }) {
      id

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
        id
      }

      _count {
        comment
      }

      category {
        name
      }
    }
  }
`
