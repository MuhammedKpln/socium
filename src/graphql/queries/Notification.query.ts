import type { INotification } from '@/Types/notification.type'
import { gql } from '@apollo/client'

export interface IFetchNotificationsResponse {
  getNotifications: INotification[]
  getReadedNotifications: INotification[]
}

export const FETCH_NOTIFICATIONS = gql`
  query FETCH_NOTIFICATIONS {
    getNotifications {
      id
      user {
        username
        avatar
      }

      actor {
        username
        avatar
      }
      notificationType
      entityType
      readed
      created_at
      entity {
        __typename
        ... on PostEntity {
          id
        }

        ... on Follower {
          user {
            username
          }
        }
      }
    }

    getReadedNotifications {
      id
      user {
        username
        avatar
      }

      actor {
        username
        avatar
      }
      notificationType
      entityType
      created_at
      readed
      entity {
        __typename
        ... on PostEntity {
          id
        }

        ... on Follower {
          user {
            username
          }
        }
      }
    }
  }
`
