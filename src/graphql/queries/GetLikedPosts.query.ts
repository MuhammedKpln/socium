import { gql } from '@apollo/client'

export const GET_LIKED_POSTS = gql`
  query GET_LIKED_POSTS {
    userLikedPosts {
      post {
        id
        content
        type
        slug
        created_at
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

        category {
          name
        }
      }
    }
  }
`
