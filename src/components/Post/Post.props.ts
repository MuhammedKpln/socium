import { IUser } from '@/Types/login.types'
import { PostType } from '@/Types/post.types'
import React from 'react'

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
  title: string | React.ReactElement
  content: string
  date: Date
  commentsCount: number
  likesCount: number
  isLiked: boolean
  user: IUser
  postType: PostType
} & typeof defaultProps
