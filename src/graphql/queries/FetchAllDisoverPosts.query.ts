import { gql } from '@apollo/client'

export const FETCH_ALL_DISCOVER_POSTS = gql`
  query FETCH_ALL_DISCOVER_POSTS($limit: Float! = 15, $offset: Float! = 0) {
    postsWithoutBlog(pagination: { limit: $limit, offset: $offset }) {
      id
      title
      content
      type

      user {
        id
        username
        avatar
      }
    }
  }
`
export const FETCH_ALL_DISCOVER_BLOG_POSTS = gql`
  query FETCH_ALL_DISCOVER_POSTS($limit: Float! = 15, $offset: Float! = 0) {
    postsOnlyBlog(pagination: { limit: $limit, offset: $offset }) {
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
