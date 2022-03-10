import React from 'react'
import { ActivityIndicator } from 'react-native'
import UIButton from 'react-native-ui-lib/button'
import type { IButtonProps } from './Button.props'

export default function Button(props: IButtonProps) {
  return (
    <UIButton {...props}>
      {props.loading ? (
        <ActivityIndicator size="small" style={{ marginRight: 10 }} />
      ) : null}
      {props.children}
    </UIButton>
  )
}

export const ButtonSizes = UIButton.sizes
