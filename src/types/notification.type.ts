import type { IComment } from './comment.types'
import type { IFollowers } from './followers.types'
import type { IUser } from './login.types'
import type { IPost } from './post.types'

export enum NotificationType {
  Follow = 1,
  PostComment = 2,
}

export interface INotification {
  id: number
  user: IUser
  actor: IUser
  notificationType: NotificationType
  readed: boolean
  created_at: Date
  updated_at: Date
  entityType: 'post' | 'follower'
  entity: IPost & IComment & IFollowers
}

export interface INotificationSettings {
  follower: boolean
  messageRequest: boolean
  comments: boolean
  disableAll: boolean
}
