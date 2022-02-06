import React, { Component, forwardRef, memo, Ref } from 'react'
import { ViewProps } from 'react-native-ui-lib'
import View from 'react-native-ui-lib/view'
import { ISurfaceProps } from './Surface.props'

export const _Surface = forwardRef(
  (props: ISurfaceProps, _ref: Ref<Component<ViewProps>>) => {
    const { children } = props

    return (
      <View bg-surfaceBG {...props} ref={_ref}>
        {children}
      </View>
    )
  },
)

export const Surface = memo(_Surface)
