import { Page } from '@/components/Page/Page.component'
import {
  SkeletonView,
  SkeletonViewContentTypes,
  SkeletonViewTemplates,
} from '@/components/SkeletonView/SkeletonView.component'
import { wait } from '@/utils/utils'
import React, { useCallback, useEffect, useState } from 'react'
import { FlatList } from 'react-native'
import Text from 'react-native-ui-lib/text'
import View from 'react-native-ui-lib/view'
import { ChatBox } from './components/Chatbox.component'
import { RecentlyMatched } from './components/RecentlyMatched.component'
import { Search } from './components/Search.component'

export function ChatContainer() {
  const [showContent, setShowContent] = useState<boolean>(false)

  useEffect(() => {
    wait(2000).then(() => setShowContent(true))
  }, [])

  const renderChatBox = useCallback(() => {
    return <ChatBox />
  }, [])

  const renderData = useCallback(() => {
    return <FlatList data={Array(5)} renderItem={renderChatBox} />
  }, [renderChatBox])

  return (
    <Page>
      <View margin-10>
        <Search />
      </View>

      <Text fontGilroyBold font17>
        Eşleşilenler
      </Text>
      <View marginT-20>
        <RecentlyMatched />
      </View>

      <View marginV-30>
        <Text fontGilroyBold font17>
          Sohbetler
        </Text>
      </View>

      <View>
        <SkeletonView
          showContent={showContent}
          renderContent={renderData}
          times={6}
          template={SkeletonViewTemplates.LIST_ITEM}
          listProps={{
            contentType: SkeletonViewContentTypes.AVATAR,
          }}
        />
      </View>
    </Page>
  )
}
