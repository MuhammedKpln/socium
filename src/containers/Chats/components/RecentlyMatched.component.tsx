import { Avatar } from '@/components/Avatar/Avatar.component'
import { SkeletonView } from '@/components/SkeletonView/SkeletonView.component'
import type { IMessageRequests } from '@/types/messages.types'
import React, { useCallback } from 'react'
import { FlatList, TouchableOpacity } from 'react-native'
import Fader from 'react-native-ui-lib/fader'
import Text from 'react-native-ui-lib/text'
import View from 'react-native-ui-lib/view'

interface IProps {
  messageRequests: IMessageRequests[]
  loading: boolean
  onPress: (messageRequest: IMessageRequests) => void
}

export function RecentlyMatched(props: IProps) {
  const { messageRequests, loading, onPress } = props

  const renderItem = useCallback(
    ({ item }: { item: IMessageRequests }) => {
      return (
        <TouchableOpacity onPress={() => onPress(item)}>
          <View marginR-20>
            <Avatar
              userAvatar={item.requestFrom.avatar}
              size={75}
              onPress={() => onPress(item)}
            />
            <Text fontSfProRegular font12 marginT-10 center>
              @{item.requestFrom.username}
            </Text>
          </View>
        </TouchableOpacity>
      )
    },
    [onPress],
  )

  const renderData = useCallback(() => {
    return (
      <View marginT-10>
        <FlatList horizontal renderItem={renderItem} data={messageRequests} />

        {messageRequests.length > 5 && (
          <Fader position={Fader.position.END} size={100} />
        )}
      </View>
    )
  }, [renderItem, messageRequests])

  return (
    <View row>
      <SkeletonView
        renderContent={renderData}
        showContent={!loading}
        circle
        width={75}
        height={75}
        times={messageRequests.length}
        style={{ marginRight: 20 }}
      />
    </View>
  )
}
