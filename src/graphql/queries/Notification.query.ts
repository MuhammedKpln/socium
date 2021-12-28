import { gql } from '@apollo/client'

export const FETCH_NOTIFICATIONS = gql`
  query FETCH_NOTIFICATIONS {
    getNotifications {
      id
      user {
        username
      }

      actor {
        username
      }
      notificationType
      entityType
      entity {
        __typename
        ... on PostEntity {
          slug
        }

        ... on Follower {
          user {
            id
            username
          }
        }
      }
    }

    getReadedNotifications {
      id
      user {
        username
      }

      actor {
        username
      }
      notificationType
      entityType
      entity {
        __typename
        ... on PostEntity {
          slug
        }

        ... on Follower {
          user {
            id
            username
          }
        }
      }
    }
  }
`
