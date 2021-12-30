import React from 'react'
import View from 'react-native-ui-lib/view'
import { ISurfaceProps } from './Surface.props'

export const Surface = (props: ISurfaceProps) => {
  const { children } = props

  return (
    <View bg-surfaceBG {...props}>
      {children}
    </View>
  )
}
