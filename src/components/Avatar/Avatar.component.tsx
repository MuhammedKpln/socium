import { avatarStatic } from '@/utils/static'
import React, { useMemo } from 'react'
import FastImage from 'react-native-fast-image'
import { View } from 'react-native-ui-lib'
import { IAvatarProps } from './Avatar.props'

export function Avatar(props: IAvatarProps) {
  const { userAvatar } = props
  const size = useMemo(() => (props?.size ? props.size : 40), [props.size])

  const userAvatarUrl = useMemo(() => avatarStatic(userAvatar), [userAvatar])

  return (
    <View
      style={{
        backgroundColor: '#F3F5F7',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: size,
        height: size,
        overflow: 'hidden',
        borderRadius: size,
      }}
    >
      <FastImage
        source={{ uri: userAvatarUrl }}
        fallback
        resizeMode="contain"
        style={{
          width: size - 5,
          height: size - 5,
          marginTop: 8,
        }}

        // imageStyle={{
        //   width: props.size - 10,
        //   height: props.size - 10,
        //   marginTop: 13,
        //   marginLeft: 5,
        // }}
        // imageProps={{
        //   source: { uri: userAvatarUrl },
        //   resizeMode: 'contain',
        //   resizeMethod: 'scale',
        // }}
      />
    </View>
  )
}
