import { IComment } from './comment.types'
import { IUser } from './login.types'

export interface IResponseData<T> {
  data: T
}

interface IPostCount {
  comment: number
}

export interface IPost {
  title: string
  type: number
  color: string
  user: IUser
  id: number
  created_at: Date
  updated_at: Date
  content: string
  slug: string
  userLike: IUserlike
  postLike: IPostLike
  _count: IPostCount
  postFromFollowers?: boolean
  category?: ICategory
}

export interface ICategory {
  id: number
  created_at: Date
  updated_at: Date
  name: string
  description: string
  image: string
}

export interface IPostLike {
  id: number
  created_at: Date
  updated_at: Date
  likeCount: number
}

export interface IUserlike {
  id?: number
  created_at?: Date
  updated_at?: Date
  liked: boolean
  post?: IPost
  comment?: IComment
  user?: IUser
}

export interface INewPostArgs {
  title: string
  content: string
  type: number
  categoryId: number
}

export enum PostType {
  Content = 0,
  Instagram = 1,
  Twitter = 2,
  Youtube = 3,
  Blog = 4,
}
