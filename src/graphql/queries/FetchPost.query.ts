import { UserFragment } from '@/graphql/fragments/User.fragment'
import { IPost } from '@/Types/post.types'
import { gql } from '@apollo/client'

export interface IFetchPostVariables {
  id: number
}

export interface IFetchPostResponse {
  post: IPost
}

export const FETCH_POST = gql`
  ${UserFragment}

  query FETCH_POST($id: Float!) {
    post(id: $id) {
      content
      id
      type
      slug
      postLike {
        likeCount
      }
      userLike {
        liked
      }
      user {
        ...UserFields
      }
      category {
        name
      }
      _count {
        comment
      }
    }
  }
`
