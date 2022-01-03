import React, { useMemo } from 'react'
import UIAvatar from 'react-native-ui-lib/avatar'

interface IProps {
  username: string
}

export function NoAvatar(props: IProps) {
  const svg = useMemo(
    () => (
      <UIAvatar
        source={{
          uri: `https://avatars.dicebear.com/api/micah/${props.username}.png`,
        }}
        size={30}
      />
    ),
    [props.username],
  )

  return svg
}
