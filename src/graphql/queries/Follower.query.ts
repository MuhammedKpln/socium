import { gql } from '@apollo/client'

export const USER_FOLLOWERS = gql`
  query USER_FOLLOWERS(
    $userId: Float!
    $offset: Float = 0
    $limit: Float = 15
  ) {
    getUserFollowers(
      userId: $userId
      pagination: { offset: $offset, limit: $limit }
    ) {
      actor {
        username
        avatar
      }
      user {
        username
        avatar
      }
    }
  }
`
export const USER_FOLLOWINGS = gql`
  query USER_FOLLOWINGS(
    $userId: Float!
    $offset: Float = 0
    $limit: Float = 15
  ) {
    getUserFollowings(
      userId: $userId
      pagination: { offset: $offset, limit: $limit }
    ) {
      actor {
        id
        username
        avatar
      }
      user {
        id
        username
        avatar
      }
    }
  }
`
