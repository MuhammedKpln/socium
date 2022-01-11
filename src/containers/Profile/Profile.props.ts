import { IPost } from '@/types/post.types'

export interface IPostsTabProps {
  posts: IPost[]
}
export interface ICommentsTabProps {
  userId: number
}
