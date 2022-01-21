import { IUser } from '@/Types/login.types'
import { PostType } from '@/Types/post.types'

interface IDefaultProps {
  showTitle?: boolean
}

const defaultProps: IDefaultProps = {
  showTitle: true,
}

export type IPostProps = {
  onPressComment: () => void
  onPressLike: () => void
  onPressPost: () => void
  onPressRemove?: () => null
  onPressSave: () => void
  content: string
  date: Date
  commentsCount: number
  likesCount: number
  isLiked: boolean
  user: IUser
  postType: PostType
  additional?: string
} & typeof defaultProps

export interface IPostActionsProps {
  isLiked: boolean
  likesCount: string
  commentsCount: string
  showDate?: boolean
  date?: Date
  onPressLike: () => void
  onPressComment: () => void
  onPressSave: () => void
}
