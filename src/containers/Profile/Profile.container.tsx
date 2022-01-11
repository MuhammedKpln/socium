import { Icon } from '@/components/Icon/Icon.component'
import { Page } from '@/components/Page/Page.component'
import { Post } from '@/components/Post/Post.component'
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
import { ActivityIndicator, FlatList } from 'react-native'
import { Image, TabController, Text, View } from 'react-native-ui-lib'

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
    <Page margin-20>
      <View row spread>
        <View row>
          <Image
            source={{ uri: 'https://i.hizliresim.com/burqynw.png' }}
            width={88}
            height={88}
          />
          <View marginL-20 marginT-20>
            <Text textColor header fontGilroy>
              Çağatay Köroğlu
            </Text>
            <Text document greyText marginT-10>
              @{user.data?.getUser.username}
            </Text>
          </View>
        </View>
        <View marginT-35>
          <Icon name="pencil" size={25} color="#C5C5C5" />
        </View>
      </View>

      <View row margin-15 marginT-50 spread>
        <View>
          <Text text textColor center style={{ width: 55 }}>
            24 Gönderi
          </Text>
        </View>
        <View>
          <Text text textColor center style={{ width: 55 }}>
            12B Takipçi
          </Text>
        </View>
        <View>
          <Text text textColor center>
            246
          </Text>
          <Text text textColor center>
            Takip Edilen
          </Text>
        </View>
      </View>

      <TabController items={tabItems}>
        <View flex>
          <TabController.TabBar />
          <TabController.TabPage index={0}>
            <FlatList
              data={user.data?.userPosts}
              style={{ height: '100%', width: '100%' }}
              renderItem={({ item }) => {
                return (
                  <Post
                    title={item.title}
                    commentsCount={item._count.comment}
                    date={item.created_at}
                    likesCount={item.postLike.likeCount}
                    onPressPost={() => {
                      navigate(Routes.PostDetails, { postId: item.id })
                    }}
                    postType={item.type}
                    isLiked={item.userLike?.liked}
                    key={item.slug}
                    user={item.user}
                    onPressRemove={() => null}
                    content={item.content}
                    onPressComment={() => null}
                    onPressSave={() => null}
                    onPressLike={() => null}
                  />
                )
              }}
            />
          </TabController.TabPage>
          <TabController.TabPage
            index={1}
            lazy
            lazyLoadTime={3000}
            renderLoading={() => <ActivityIndicator />}
          >
            <FlatList
              data={user.data?.userPosts}
              style={{ height: '100%', width: '100%' }}
              renderItem={({ item }) => {
                return (
                  <Post
                    title={item.title}
                    commentsCount={item._count.comment}
                    date={item.created_at}
                    likesCount={item.postLike.likeCount}
                    onPressPost={() => {
                      navigate(Routes.PostDetails, { postId: item.id })
                    }}
                    postType={item.type}
                    isLiked={item.userLike?.liked}
                    key={item.slug}
                    user={item.user}
                    onPressRemove={() => null}
                    content={item.content}
                    onPressComment={() => null}
                    onPressSave={() => null}
                    onPressLike={() => null}
                  />
                )
              }}
            />
          </TabController.TabPage>
        </View>
      </TabController>
    </Page>
  )
}
