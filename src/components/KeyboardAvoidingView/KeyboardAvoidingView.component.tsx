import React from 'react'
import {
  KeyboardAvoidingView as RNKeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  Platform,
} from 'react-native'

interface IProps extends KeyboardAvoidingViewProps {
  children: React.ReactNode
}

export function KeyboardAvoidingView(props: IProps) {
  return (
    <RNKeyboardAvoidingView
      behavior={Platform.select({
        android: undefined,
        ios: 'height',
      })}
      {...props}
    >
      {props.children}
    </RNKeyboardAvoidingView>
  )
}
