import gql from 'graphql-tag'

export const IS_USER_FOLLOWING_ACTOR = gql`
  query IS_USER_FOLLOWING_ACTOR($userId: Float!, $actorId: Float!) {
    userFollowsActor(userId: $userId, actorId: $actorId)
  }
`
