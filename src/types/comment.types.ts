import { IUser } from '@/Types/login.types'
import { IPost, IPostLike, IUserlike } from './post.types'

export interface IComment {
  id: number
  content: string
  created_at: Date
  updated_at: Date
  post: IPost
  user: IUser
  userLike: IUserlike | null
  postLike: IPostLike
  parentComments: IComment[]
}
