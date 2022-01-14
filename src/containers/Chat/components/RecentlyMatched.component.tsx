import { NoAvatar } from '@/components/NoAvatar/NoAvatar.component'
import { SkeletonView } from '@/components/SkeletonView/SkeletonView.component'
import { wait } from '@/utils/utils'
import React, { useCallback, useEffect, useState } from 'react'
import { FlatList } from 'react-native'
import { Text, View } from 'react-native-ui-lib'

export function RecentlyMatched() {
  const [showContent, setShowContent] = useState<boolean>(false)

  useEffect(() => {
    wait(2000).then(() => setShowContent(true))
  }, [])

  const renderItem = useCallback(() => {
    return (
      <View marginR-20>
        <NoAvatar username="saieqw" size={75} />
        <Text fontSfProRegular font12 marginT-10>
          Cansu Yılmaz
        </Text>
      </View>
    )
  }, [])

  const renderData = useCallback(() => {
    return <FlatList horizontal renderItem={renderItem} data={Array(5)} />
  }, [renderItem])

  return (
    <View row>
      <SkeletonView
        renderContent={renderData}
        showContent={showContent}
        circle
        width={75}
        height={75}
        times={5}
        style={{ marginRight: 20 }}
      />
    </View>
  )
}
