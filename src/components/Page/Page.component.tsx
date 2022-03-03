import React, { forwardRef, memo, Ref } from 'react'
import type { SafeAreaView } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import View from 'react-native-ui-lib/view'
import type { IPageProps } from './Page.props'

export const _Page = forwardRef((props: IPageProps, ref: Ref<SafeAreaView>) => {
  const { scrollable, children } = props

  return (
    <View flex bg-screenBG style={{ padding: 20 }} {...props} ref={ref}>
      {scrollable ? (
        <KeyboardAwareScrollView>{children}</KeyboardAwareScrollView>
      ) : (
        children
      )}
    </View>
  )
})

export const Page = memo(_Page)
