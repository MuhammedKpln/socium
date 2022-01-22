import React from 'react'
import {
  KeyboardAvoidingView as RNKeyboardAvoidingView,
  Platform,
} from 'react-native'

interface IProps {
  children: React.ReactNode
}

export function KeyboardAvoidingView(props: IProps) {
  return (
    <RNKeyboardAvoidingView
      behavior={Platform.select({
        android: 'height',
        ios: 'padding',
      })}
      enabled
    >
      {props.children}
    </RNKeyboardAvoidingView>
  )
}
