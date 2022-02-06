import { INavigatorParamsList, Routes } from '@/navigators/navigator.props'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, { useLayoutEffect, useMemo } from 'react'
import {
  TabController,
  TabControllerItemProps,
  View,
} from 'react-native-ui-lib'
import { Followers } from './components/Followers.component'
import { Followings } from './components/Followings.component'

export function FollowersContainer() {
  const {
    params: { userId, username },
  } = useRoute<RouteProp<INavigatorParamsList, Routes.Followers>>()
  const navigation = useNavigation()
  const items = useMemo<TabControllerItemProps[]>(() => {
    return [
      {
        label: 'Takipçiler',
      },
      {
        label: 'Takip edilenler',
      },
    ]
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      title: username,
    })
  }, [navigation, username])

  return (
    <View flex>
      <TabController items={items} asCarousel>
        <TabController.TabBar enableShadow />
        <TabController.PageCarousel>
          <TabController.TabPage index={0}>
            <Followers userId={userId} />
          </TabController.TabPage>
          <TabController.TabPage index={1} lazy>
            <Followings userId={userId} />
          </TabController.TabPage>
        </TabController.PageCarousel>
      </TabController>
    </View>
  )
}
