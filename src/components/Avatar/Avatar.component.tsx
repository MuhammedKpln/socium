import { avatarStatic } from '@/utils/static'
import React from 'react'
import { IAvatarProps } from './Avatar.props'
import UIAvatar from 'react-native-ui-lib/avatar'

export function Avatar(props: IAvatarProps) {
  const { userAvatar, size } = props

  const userAvatarUrl = avatarStatic(userAvatar)

  return <UIAvatar source={{ uri: userAvatarUrl }} size={size || 30} />
}
