import { UserFragment } from '@/graphql/fragments/User.fragment'
import { gql } from '@apollo/client'

export const FETCH_POST = gql`
  ${UserFragment}

  query FETCH_POST($id: Float!) {
    post(id: $id) {
      title
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
