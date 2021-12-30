import React, { Component, forwardRef, Ref } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { ViewProps } from 'react-native-ui-lib'
import View from 'react-native-ui-lib/view'
import { IPageProps } from './Page.props'

export const Page = forwardRef(
  (props: IPageProps, ref: Ref<Component<ViewProps>>) => {
    const { scrollable, children } = props

    return (
      <View flex bg-screenBG useSafeArea {...props} ref={ref}>
        {scrollable ? <ScrollView>{children}</ScrollView> : children}
      </View>
    )
  },
)
