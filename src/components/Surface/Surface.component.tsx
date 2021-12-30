import React, { Component, forwardRef, Ref } from 'react'
import { ViewProps } from 'react-native-ui-lib'
import View from 'react-native-ui-lib/view'
import { ISurfaceProps } from './Surface.props'

export const Surface = forwardRef(
  (props: ISurfaceProps, _ref: Ref<Component<ViewProps>>) => {
    const { children } = props

    return (
      <View bg-surfaceBG {...props} ref={_ref}>
        {children}
      </View>
    )
  },
)
