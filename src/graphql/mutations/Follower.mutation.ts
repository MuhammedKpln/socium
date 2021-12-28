import { gql } from '@apollo/client'

export interface IFollowUserArgs {
  actorId: number
}

export interface IFollowUserResponse {
  followUser: boolean
}
export interface IUnFollowUserResponse {
  unfollowUser: boolean
}

export const FOLLOW_USER = gql`
  mutation FOLLOW_USER($actorId: Float!) {
    followUser(actorId: $actorId)
  }
`

export const UNFOLLOW_USER = gql`
  mutation UNFOLLOW_USER($actorId: Float!) {
    unfollowUser(actorId: $actorId)
  }
`
