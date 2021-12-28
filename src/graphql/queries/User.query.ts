import { UserFragment } from '@/graphql/fragments/User.fragment'
import gql from 'graphql-tag'

export const FETCH_USER_PRFOFILE = gql`
  ${UserFragment}

  query GET_USER_PROFILE($username: String!) {
    getUser(username: $username) {
      id
      username
      bio
      avatar
      birthday

      _count {
        followers
        followings
        posts
      }
    }

    userPosts(username: $username) {
      id
      title
      content
      postLike {
        likeCount
      }
      type
      userLike {
        liked
      }
      slug

      user {
        ...UserFields
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
