import { IFollowers } from '@/Types/followers.types'
import { gql } from '@apollo/client'

export interface IFollowArgs {
  actorId: number
}

export interface IFollowUserResponse {
  followUser: IFollowers
}
export interface IUnFollowUserResponse {
  unfollowUser: boolean
}

export const FOLLOW_USER = gql`
  mutation FOLLOW_USER($actorId: Float!) {
    followUser(actorId: $actorId) {
      id
      user {
        id
        username
        avatar
      }
      actor {
        id
        username
        avatar
      }
      userId
      actorId
    }
  }
`

export const UNFOLLOW_USER = gql`
  mutation UNFOLLOW_USER($actorId: Float!) {
    unfollowUser(actorId: $actorId)
  }
`
