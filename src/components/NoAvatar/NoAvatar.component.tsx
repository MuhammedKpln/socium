import { avatarStatic } from '@/utils/static'
import React, { useMemo } from 'react'
import FastImage from 'react-native-fast-image'

interface IProps {
  size?: number
}

export const NoAvatar = React.memo((props: IProps) => {
  const randomAvatar = useMemo(() => {
    const randomNumber = Math.floor(Math.random() * 50)

    return `avatar${randomNumber}`
  }, [])

  return (
    <FastImage
      source={{ uri: avatarStatic(randomAvatar), cache: 'immutable' }}
      style={{
        width: props.size || 30,
        height: props.size || 30,
        borderRadius: props.size || 30,
      }}
    />
  )
})
