import { gql } from '@apollo/client'

export interface IISUserFollowingActorVariables {
  userId: number
  actorId: number
}

export interface IISUserFollowingActorResponse {
  userFollowsActor: boolean
}

export const IS_USER_FOLLOWING_ACTOR = gql`
  query IS_USER_FOLLOWING_ACTOR($userId: Float!, $actorId: Float!) {
    userFollowsActor(userId: $userId, actorId: $actorId)
  }
`
