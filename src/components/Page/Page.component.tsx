import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import View from 'react-native-ui-lib/view'
import { IPageProps } from './Page.props'

export const Page = (props: IPageProps) => {
  const { scrollable, children } = props

  return (
    <View flex bg-screenBG useSafeArea {...props}>
      {scrollable ? <ScrollView>{children}</ScrollView> : children}
    </View>
  )
}
