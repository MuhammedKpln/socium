import React, { useCallback, useEffect, useState } from 'react'
import { Keyboard } from 'react-native'
import { Colors } from 'react-native-ui-lib'
import UIDialog from 'react-native-ui-lib/dialog'
import Text from 'react-native-ui-lib/text'
import View from 'react-native-ui-lib/view'

interface IProps {
  title: string
  visible: boolean
  onDismiss: () => void
  children: React.ReactNode
  bottom?: boolean
  actions?: React.ReactNode
}

export function Dialog(props: IProps) {
  const { visible, title, children, onDismiss, actions } = props
  const [padding, setPadding] = useState(0)

  useEffect(() => {
    const showEvent = Keyboard.addListener('keyboardWillShow', e => {
      setPadding(e.endCoordinates.height)
    })
    const hideEvent = Keyboard.addListener('keyboardWillHide', () => {
      setPadding(0)
    })

    return () => {
      showEvent.remove()
      hideEvent.remove()
    }
  }, [])

  const renderHeader = useCallback(() => {
    return (
      <View>
        <View margin-20>
          <Text>{title}</Text>
        </View>
        <View height={2} bg-grey70 />
      </View>
    )
  }, [title])

  return (
    <UIDialog
      visible={visible}
      containerStyle={{
        backgroundColor: Colors.white,
        paddingBottom: padding,
      }}
      onDismiss={onDismiss}
      useSafeArea
      modalProps={{
        useGestureHandlerRootView: true,
      }}
      renderPannableHeader={renderHeader}
      bottom
      centerH
    >
      <View padding-20>
        {children}
        {actions ? (
          <View>
            <View right padding-10>
              {actions ? actions : null}
            </View>
            {/* <UIDialog.Divider /> */}
          </View>
        ) : null}
        {/* <UIDialog.Knob /> */}
      </View>

      {/* <UIDialog.Divider /> */}
    </UIDialog>
  )
}
