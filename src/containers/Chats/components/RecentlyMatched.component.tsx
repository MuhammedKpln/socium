import { Avatar } from '@/components/Avatar/Avatar.component'
import { SkeletonView } from '@/components/SkeletonView/SkeletonView.component'
import { IMessageRequests } from '@/types/messages.types'
import React, { useCallback } from 'react'
import { FlatList } from 'react-native'
import Text from 'react-native-ui-lib/text'
import View from 'react-native-ui-lib/view'

interface IProps {
  messageRequests: IMessageRequests[]
  loading: boolean
}

export function RecentlyMatched(props: IProps) {
  const { messageRequests, loading } = props

  const renderItem = useCallback(({ item }: { item: IMessageRequests }) => {
    return (
      <View marginR-20>
        <Avatar userAvatar={item.requestFrom.avatar} size={75} />
        <Text fontSfProRegular font12 marginT-10 center>
          @{item.requestFrom.username}
        </Text>
      </View>
    )
  }, [])

  const renderData = useCallback(() => {
    return (
      <View marginT-10>
        <FlatList horizontal renderItem={renderItem} data={messageRequests} />
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
