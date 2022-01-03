import React from 'react'
import { ActivityIndicator } from 'react-native'
import UIButton from 'react-native-ui-lib/button'
import { IButtonProps } from './Button.props'

export default function Button(props: IButtonProps) {
  return (
    <UIButton {...props}>
      {props.loading ? <ActivityIndicator /> : null}
      {props.children}
    </UIButton>
  )
}
