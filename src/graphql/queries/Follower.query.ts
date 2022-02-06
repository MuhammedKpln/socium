import { IFollowers } from '@/types/followers.types'
import { gql } from '@apollo/client'

export interface IUserFollowersVariables {
  userId: number
}

export interface IUserFollowersResponse {
  getUserFollowers: IFollowers[]
}
export interface IUserFollowingsVariables {
  userId: number
}

export interface IUserFollowingsResponse {
  getUserFollowings: IFollowers[]
}

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
      id
      user {
        id
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
