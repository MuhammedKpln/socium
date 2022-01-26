import { IComment } from './comment.types'

export interface ILoginGoogleData {
  email: string
  idToken: string
}

interface IUserCount {
  posts: number
  followers: number
  followings: number
}

interface IUserAvatarMeta {
  avatar: string
}

export interface IUser {
  id: number
  username: string
  email: string
  gender: 0 | 1
  avatar: string
  bio: string | null
  isEmailConfirmed: boolean
  created_at: Date
  update_at: Date
  blockIncomingCalls: boolean
  birthday: string
  _count: IUserCount
  userAvatarMeta: IUserAvatarMeta
  userParentComments?: IComment[]
}

export interface IErrorResponse {
  error_code: number
  status: boolean
}

export interface ILogin {
  access_token: string
  refresh_token: string
  user: IUser
  error_code?: number
  status?: boolean
  expire_date: Date
}
