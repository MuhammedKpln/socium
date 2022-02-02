import { avatarStatic } from '@/utils/static'
import React, { useMemo } from 'react'
import FastImage from 'react-native-fast-image'
import { TouchableOpacity, View } from 'react-native-ui-lib'
import { Badge } from '../Badge/Badge.component'
import { IAvatarProps } from './Avatar.props'

export function Avatar(props: IAvatarProps) {
  const { userAvatar } = props
  const size = useMemo(() => (props?.size ? props.size : 40), [props.size])

  const userAvatarUrl = useMemo(() => avatarStatic(userAvatar), [userAvatar])

  return (
    <TouchableOpacity onPress={props?.onPress}>
      <View row>
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
            resizeMode="contain"
            style={{
              width: size - 5,
              height: size - 5,
              marginTop: 8,
            }}
          />
        </View>
        {props.showBadge && (
          <Badge {...props?.badgeProps} containerStyle={{ marginLeft: -15 }} />
        )}
      </View>
    </TouchableOpacity>
  )
}
