import { IPost } from '@/Types/post.types'
import { gql } from '@apollo/client'

export interface IFetchCategoryPostsVariables {
  categoryId: number
}
export interface IFetchCategoryPostsResponse {
  posts: IPost[]
}

export const FETCH_CATEGORY_POSTS = gql`
  query CATEGORY_POSTS(
    $categoryId: Float!
    $limit: Float! = 15
    $offset: Float! = 0
  ) {
    posts(
      categoryId: $categoryId
      pagination: { limit: $limit, offset: $offset }
    ) {
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
        avatar
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
