import React, { useState } from 'react'
import { useMemo } from 'react'
import {
  Colors,
  Text,
  View,
  ActionSheet,
  TouchableOpacity,
} from 'react-native-ui-lib'

interface IProps {
  message?: string
  isSelf?: boolean
  createdAt?: Date
  customElement?: React.ReactElement
}

function _ChatBubble(props: IProps) {
  const [showActionSheet, setShowActionSheet] = useState(false)
  const { message, isSelf, createdAt, customElement } = props

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

  return (
    <View right={isSelf ? true : false} left={isSelf ? false : true} margin-10>
      <TouchableOpacity
        onLongPress={
          !customElement ? () => setShowActionSheet(prev => !prev) : undefined
        }
      >
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
          title={'Title'}
          message={'Message of action sheet'}
          cancelButtonIndex={3}
          destructiveButtonIndex={0}
          useNativeIOS={true}
          options={[{ label: 'option 1' }]}
          visible={showActionSheet}
          onDismiss={() => setShowActionSheet(false)}
        />
      ) : null}
    </View>
  )
}

export const ChatBubble = React.memo(_ChatBubble)
