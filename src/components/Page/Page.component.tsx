import { useNavigation } from '@react-navigation/native'
import React, { forwardRef, memo, Ref, useMemo } from 'react'
import type { SafeAreaView } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import View from 'react-native-ui-lib/view'
import type { IPageProps } from './Page.props'

export const _Page = forwardRef((props: IPageProps, ref: Ref<SafeAreaView>) => {
  const { scrollable, children } = props
  const safeArea = useSafeAreaInsets()
  const navigation = useNavigation()
  const isModal = useMemo(() => {
    return (
      navigation.getState().type === 'modal' ||
      navigation.getState().type === 'transparentModal'
    )
  }, [navigation])

  return (
    <View
      flex
      bg-screenBG
      style={{
        padding: 20,
        paddingTop: isModal ? safeArea.top : undefined,
      }}
      {...props}
      ref={ref}
    >
      {scrollable ? (
        <KeyboardAwareScrollView style={{ width: '100%', height: '100%' }}>
          {children}
        </KeyboardAwareScrollView>
      ) : (
        children
      )}
    </View>
  )
})

export const Page = memo(_Page)
