import React, { forwardRef, Ref } from 'react'
import { SafeAreaView } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { View } from 'react-native-ui-lib'
import { IPageProps } from './Page.props'

export const Page = forwardRef((props: IPageProps, ref: Ref<SafeAreaView>) => {
  const { scrollable, children } = props

  return (
    <View flex style={{ padding: 20 }} {...props} ref={ref}>
      {scrollable ? <ScrollView>{children}</ScrollView> : children}
    </View>
  )
})
