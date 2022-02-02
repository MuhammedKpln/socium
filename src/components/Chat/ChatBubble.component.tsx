import Clipboard from '@react-native-community/clipboard'
import React, { useCallback, useMemo, useState } from 'react'
import { Colors } from 'react-native-ui-lib'
import ActionSheet from 'react-native-ui-lib/actionSheet'
import Text from 'react-native-ui-lib/text'
import TouchableOpacity from 'react-native-ui-lib/touchableOpacity'
import View from 'react-native-ui-lib/view'

interface IProps {
  id?: number
  message?: string
  isSelf?: boolean
  createdAt?: Date
  customElement?: React.ReactElement
  onPressRemove?: (messageId: number) => void
}

function _ChatBubble(props: IProps) {
  const { message, isSelf, createdAt, customElement } = props
  const [showActionSheet, setShowActionSheet] = useState(false)

  const bgColor = useMemo(
    () => (isSelf ? Colors.primary : Colors.white),
    [isSelf],
  )

  const textColor = useMemo(
    () => (isSelf ? Colors.white : Colors.black),
    [isSelf],
  )

  const date = useMemo(() => {
    if (!createdAt) return null

    const _date = new Date(createdAt)

    return `${_date.getHours()}:${_date.getMinutes()}`
  }, [createdAt])

  const copyMessage = useCallback(_message => {
    Clipboard.setString(_message as string)
  }, [])

  return (
    <View right={isSelf ? true : false} left={isSelf ? false : true} margin-10>
      <TouchableOpacity onLongPress={() => setShowActionSheet(prev => !prev)}>
        <View
          backgroundColor={bgColor}
          padding-20
          style={{ maxWidth: 300 }}
          br100
        >
          {customElement ? (
            customElement
          ) : (
            <Text color={textColor}>{message}</Text>
          )}
        </View>
        {!customElement ? (
          <Text color="#BBC3CA" margin-10 fontSfProRegular font13>
            {date}
          </Text>
        ) : null}
      </TouchableOpacity>

      {!customElement ? (
        <ActionSheet
          title={'Mesaj ayarları'}
          message={message}
          cancelButtonIndex={2}
          useNativeIOS={true}
          options={[
            {
              label: 'Mesajı geri çek',
              onPress: () =>
                props.onPressRemove && props.id
                  ? props.onPressRemove(props?.id)
                  : null,
            },
            { label: 'Kopyala', onPress: () => copyMessage(message) },
            { label: 'Kapat' },
          ]}
          visible={showActionSheet}
          onDismiss={() => setShowActionSheet(false)}
        />
      ) : null}
    </View>
  )
}

export const ChatBubble = React.memo(_ChatBubble)
