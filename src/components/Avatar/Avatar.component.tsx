import { avatarStatic } from '@/utils/static'
import React, { useMemo } from 'react'
import FastImage from 'react-native-fast-image'
import { TouchableOpacity, View } from 'react-native-ui-lib'
import { Badge } from '../Badge/Badge.component'
import type { IAvatarProps } from './Avatar.props'

export const Avatar = React.memo((props: IAvatarProps) => {
  const { userAvatar } = props
  const size = useMemo(() => (props?.size ? props.size : 40), [props.size])

  const userAvatarUrl = useMemo(() => avatarStatic(userAvatar), [userAvatar])

  return (
    <TouchableOpacity onPress={props?.onPress}>
      <View row>
        {props.showBadge && (
          <Badge
            {...props?.badgeProps}
            containerStyle={{ position: 'absolute', left: 0, zIndex: 10 }}
          />
        )}
        <View
          style={[
            {
              backgroundColor: '#F3F5F7',
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              width: size,
              height: size,
              overflow: 'hidden',
              borderRadius: size,
            },
            props?.containerStyle,
          ]}
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
      </View>
    </TouchableOpacity>
  )
})
