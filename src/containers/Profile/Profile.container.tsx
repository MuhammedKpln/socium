import { Avatar } from '@/components/Avatar/Avatar.component'
import { Icon } from '@/components/Icon/Icon.component'
import { Page } from '@/components/Page/Page.component'
import { SkeletonView } from '@/components/SkeletonView/SkeletonView.component'
import {
  FETCH_USER_PRFOFILE,
  IFetchUserProfileResponse,
  IFetchUserProfileVariables,
} from '@/graphql/queries/User.query'
import { INavigatorParamsList, Routes } from '@/navigators/navigator.props'
import { navigate } from '@/navigators/utils/navigation'
import { useQuery } from '@apollo/client'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, { useLayoutEffect, useMemo } from 'react'
import { Colors } from 'react-native-ui-lib'
import TabController from 'react-native-ui-lib/tabController'
import Text from 'react-native-ui-lib/text'
import View from 'react-native-ui-lib/view'
import { CommentsTab } from './components/CommentsTab.component'
import { PostsTab } from './components/PostsTab.component'

export function ProfileContainer() {
  const navigation = useNavigation()
  const route = useRoute<RouteProp<INavigatorParamsList, Routes.MyProfile>>()
  const tabItems = useMemo(
    () => [
      {
        label: 'Gönderiler',
      },
      {
        label: 'Yorumlar',
      },
    ],
    [],
  )

  const user = useQuery<IFetchUserProfileResponse, IFetchUserProfileVariables>(
    FETCH_USER_PRFOFILE,
    {
      variables: {
        username: route.params.username,
      },
    },
  )

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Icon
          name="gear"
          size={25}
          onPress={() => navigate(Routes.Settings, {})}
        />
      ),
    })
  }, [navigation])

  return (
    <Page flex>
      <View row spread>
        <View row>
          {user.loading ? (
            <SkeletonView circle width={88} height={88} />
          ) : (
            <Avatar userAvatar={user.data?.getUser?.avatar ?? ''} size={88} />
          )}
          <View marginL-20 marginT-20>
            {user.loading ? (
              <>
                <SkeletonView width={100} height={20} />

                <View marginT-10>
                  <SkeletonView width={100} height={15} />
                </View>
              </>
            ) : (
              <>
                <Text textColor header fontGilroy>
                  {user.data?.getUser.username}
                </Text>
                <View marginT-10>
                  <Text document greyText>
                    @{user.data?.getUser.username}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
        <View marginT-35>
          <Icon name="pencil" size={25} color="#C5C5C5" />
        </View>
      </View>

      <View row margin-15 marginT-50 spread>
        <View>
          <Text text textColor center style={{ width: 55 }}>
            {user.data?.getUser._count.posts} Gönderi
          </Text>
        </View>
        <View>
          <Text text textColor center style={{ width: 55 }}>
            {user.data?.getUser._count.followers} Takipçi
          </Text>
        </View>
        <View>
          <Text text textColor center>
            {user.data?.getUser._count.followings}
          </Text>
          <Text text textColor center>
            Takip Edilen
          </Text>
        </View>
      </View>

      <View flex>
        <TabController items={tabItems}>
          <TabController.TabBar
            activeBackgroundColor={Colors.surfaceBG}
            backgroundColor={Colors.trueSurfaceBG}
            labelColor={Colors.textColor}
            containerWidth={350}
            centerSelected
          />
          <TabController.TabPage index={0}>
            <View flex marginT-50>
              <PostsTab
                posts={user.data?.userPosts ? user.data.userPosts : []}
              />
            </View>
          </TabController.TabPage>
          <TabController.TabPage index={1} lazy>
            <View marginT-30 flex>
              {user.data?.getUser && (
                <CommentsTab userId={user.data?.getUser.id} />
              )}
            </View>
          </TabController.TabPage>
        </TabController>
      </View>
    </Page>
  )
}
