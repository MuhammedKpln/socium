import { Avatar } from '@/components/Avatar/Avatar.component'
import { Icon } from '@/components/Icon/Icon.component'
import { Page } from '@/components/Page/Page.component'
import { SkeletonView } from '@/components/SkeletonView/SkeletonView.component'
import { TextInput } from '@/components/TextInput/TextInput.component'
import {
  EDIT_PROFILE,
  IEditProfileResponse,
  IEditProfileVariables,
} from '@/graphql/mutations/EditProfile.mutations'
import {
  FETCH_USER_PRFOFILE,
  IFetchUserProfileResponse,
  IFetchUserProfileVariables,
} from '@/graphql/queries/User.query'
import { INavigatorParamsList, Routes } from '@/navigators/navigator.props'
import { navigate } from '@/navigators/utils/navigation'
import { useAppSelector } from '@/store'
import { updateUser } from '@/store/reducers/user.reducer'
import { showToast, ToastStatus } from '@/utils/toast'
import { useMutation, useQuery } from '@apollo/client'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react'
import { Platform } from 'react-native'
import { Colors, DateTimePicker, TouchableOpacity } from 'react-native-ui-lib'
import TabController from 'react-native-ui-lib/tabController'
import Text from 'react-native-ui-lib/text'
import View from 'react-native-ui-lib/view'
import { useDispatch } from 'react-redux'
import { CommentsTab } from './components/CommentsTab.component'
import { PostsTab } from './components/PostsTab.component'

export function ProfileContainer() {
  const localUser = useAppSelector(state => state.userReducer.user)
  const [enableEdit, setEnableEdit] = useState<boolean>(false)
  const [username, setUsername] = useState<string>('')
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const route = useRoute<RouteProp<INavigatorParamsList, Routes.MyProfile>>()
  const [showDate, setShowDate] = useState(true)
  const todayDate = new Date()
  const maximumDate = todayDate
  maximumDate.setFullYear(todayDate.getFullYear() - 17, 11)
  const [date, setDate] = useState(
    localUser?.birthday ? new Date(localUser?.birthday) : new Date(),
  )

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
  const [editProfile] = useMutation<
    IEditProfileResponse,
    IEditProfileVariables
  >(EDIT_PROFILE)

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

  const onClickEditProfile = useCallback(() => {
    setUsername(localUser?.username ?? '')
    setEnableEdit(prev => !prev)
  }, [localUser])

  const onSubmitEditing = useCallback(async () => {
    if (username.length > 3) {
      await editProfile({
        variables: {
          username,
          birthday: date,
        },
        update: (cache, { data }) => {
          cache.writeQuery({
            query: FETCH_USER_PRFOFILE,
            variables: {
              username: localUser?.username,
            },
            data: {
              getUser: { ...data?.editProfile, ...user.data?.getUser },
              userPosts: user.data?.userPosts,
            },
          })

          //@ts-ignore
          dispatch(updateUser(data?.editProfile))
        },
        onCompleted: () => {
          showToast(ToastStatus.Success, 'Profiliniz başarıyla güncellendi')
          setEnableEdit(false)
        },
        onError: err => console.log(err),
      })
    }
  }, [editProfile, username, user, dispatch, localUser, date])

  return (
    <Page flex>
      <View row spread>
        <View row>
          {user.loading ? (
            <SkeletonView circle width={88} height={88} />
          ) : (
            <Avatar
              userAvatar={user.data?.getUser?.avatar ?? ''}
              size={88}
              showBadge={enableEdit}
              onPress={
                enableEdit ? () => navigate(Routes.ChangeAvatar, {}) : undefined
              }
              badgeProps={
                enableEdit
                  ? {
                      size: 25,
                      iconName: 'pencil',
                      iconProps: {
                        size: 15,
                        color: '#fff',
                      },
                    }
                  : undefined
              }
            />
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
                {enableEdit ? (
                  <TextInput
                    value={username}
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    containerStyle={{ width: 150 }}
                    onChangeText={setUsername}
                    onSubmitEditing={onSubmitEditing}
                    onBlur={onSubmitEditing}
                  />
                ) : (
                  <Text textColor header fontGilroy>
                    {user.data?.getUser.username}
                  </Text>
                )}

                <View marginT-10>
                  <Text document greyText>
                    @{user.data?.getUser.username}
                  </Text>
                </View>

                {enableEdit ? (
                  <View marginT-20>
                    {showDate && (
                      <DateTimePicker
                        value={date}
                        mode="date"
                        is24Hour={true}
                        maximumDate={maximumDate}
                        onChange={_date => {
                          if (_date) {
                            setDate(_date)
                            onSubmitEditing()

                            if (Platform.OS === 'android') {
                              setShowDate(false)
                            }
                          } else {
                            setShowDate(false)
                          }
                        }}
                      />
                    )}
                  </View>
                ) : null}
              </>
            )}
          </View>
        </View>
        {user.data?.getUser.id === localUser?.id ? (
          <TouchableOpacity onPress={onClickEditProfile}>
            <View marginT-35>
              <Icon name="pencil" size={25} color="#C5C5C5" />
            </View>
          </TouchableOpacity>
        ) : null}
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
