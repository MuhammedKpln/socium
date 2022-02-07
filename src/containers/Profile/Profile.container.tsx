import { Avatar } from '@/components/Avatar/Avatar.component'
import Button from '@/components/Button/Button.component'
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
  FOLLOW_USER,
  IFollowArgs,
  IFollowUserResponse,
  IUnFollowUserResponse,
  UNFOLLOW_USER,
} from '@/graphql/mutations/Follower.mutation'
import {
  INewMessageRequestResponse,
  INewMessageRequestVariables,
  IRetrieveMessageRequestResponse,
  IRetrieveMessageRequestVariables,
  NEW_MESSAGE_REQUEST,
  RETRIEVE_MESSAGE_REQUEST,
} from '@/graphql/mutations/Message.mutation'
import {
  IISUserFollowingActorResponse,
  IISUserFollowingActorVariables,
  IS_USER_FOLLOWING_ACTOR,
} from '@/graphql/queries/IsFollowingActor.query'
import {
  FETCH_USER_PRFOFILE,
  IFetchUserProfileResponse,
  IFetchUserProfileVariables,
} from '@/graphql/queries/User.query'
import {
  FETCH_USER_REQUESTS,
  IFetchUserRequestsResponse,
  IFetchUserRequestsVariables,
} from '@/graphql/queries/UserRequests.query'
import { INavigatorParamsList, Routes } from '@/navigators/navigator.props'
import { navigate } from '@/navigators/utils/navigation'
import { useAppSelector } from '@/store'
import { updateUser } from '@/store/reducers/user.reducer'
import { showToast, ToastStatus } from '@/utils/toast'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react'
import { Platform } from 'react-native'
import {
  Colors,
  DateTimePicker,
  TouchableOpacity,
  Typography,
} from 'react-native-ui-lib'
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
      onCompleted: async data => {
        await checkIfIsFollowing({
          variables: {
            actorId: data.getUser.id,
            userId: localUser?.id ?? 0,
          },
        })
        await fetchUserRequests({
          variables: {
            toUserId: data.getUser.id,
          },
        })
      },
    },
  )

  const [checkIfIsFollowing, isFollowing] = useLazyQuery<
    IISUserFollowingActorResponse,
    IISUserFollowingActorVariables
  >(IS_USER_FOLLOWING_ACTOR)

  const [fetchUserRequests, requestedMessage] = useLazyQuery<
    IFetchUserRequestsResponse,
    IFetchUserRequestsVariables
  >(FETCH_USER_REQUESTS)

  const [editProfile] = useMutation<
    IEditProfileResponse,
    IEditProfileVariables
  >(EDIT_PROFILE)

  const [followUser, followUserMeta] = useMutation<
    IFollowUserResponse,
    IFollowArgs
  >(FOLLOW_USER)

  const [unfollowUser, unfollowUserMeta] = useMutation<
    IUnFollowUserResponse,
    IFollowArgs
  >(UNFOLLOW_USER)

  const [sendMessageRequest, sendMessageRequestMeta] = useMutation<
    INewMessageRequestResponse,
    INewMessageRequestVariables
  >(NEW_MESSAGE_REQUEST)

  const [retrieveMessageRequest, retrieveMessageRequestMeta] = useMutation<
    IRetrieveMessageRequestResponse,
    IRetrieveMessageRequestVariables
  >(RETRIEVE_MESSAGE_REQUEST)

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

  const onPressFollow = useCallback(
    async (userId: number) => {
      await followUser({
        variables: {
          actorId: userId,
        },
        update: (cache, { data }) => {
          cache.writeQuery<
            IISUserFollowingActorResponse,
            IISUserFollowingActorVariables
          >({
            query: IS_USER_FOLLOWING_ACTOR,
            variables: {
              actorId: user.data?.getUser.id ?? 0,
              userId: localUser?.id ?? 0,
            },
            data: {
              userFollowsActor: data?.followUser ? true : false,
            },
          })

          const newUser = {
            ...user.data,
            getUser: {
              ...user.data?.getUser,
              _count: {
                ...user.data?.getUser._count,
                //@ts-ignore
                followers: user.data.getUser._count.followers + 1,
              },
            },
          }

          cache.writeQuery({
            query: FETCH_USER_PRFOFILE,
            variables: {
              username: localUser?.username,
            },
            data: newUser,
          })
        },
      })
    },
    [followUser, user, localUser],
  )

  const onPressUnfollow = useCallback(
    async (userId: number) => {
      await unfollowUser({
        variables: {
          actorId: userId,
        },
        update: (cache, { data }) => {
          cache.writeQuery<
            IISUserFollowingActorResponse,
            IISUserFollowingActorVariables
          >({
            query: IS_USER_FOLLOWING_ACTOR,
            variables: {
              actorId: user.data?.getUser.id ?? 0,
              userId: localUser?.id ?? 0,
            },
            data: {
              userFollowsActor: data?.unfollowUser ? false : true,
            },
          })

          console.log('seqlkm')
          const newUser = {
            ...user.data,
            getUser: {
              ...user.data?.getUser,
              _count: {
                ...user.data?.getUser._count,
                //@ts-ignore
                followers: user.data?.getUser._count.followers - 1,
              },
            },
          }

          cache.writeQuery({
            query: FETCH_USER_PRFOFILE,
            variables: {
              username: localUser?.username,
            },
            data: newUser,
          })
        },
      })
    },
    [unfollowUser, user, localUser],
  )

  const onPressSendMessageRequest = useCallback(
    async (userId: number) => {
      await sendMessageRequest({
        variables: {
          toUserId: userId,
        },
        update: (cache, { data }) => {
          const prev: IFetchUserRequestsResponse | null = cache.readQuery({
            query: FETCH_USER_REQUESTS,
            variables: {
              toUserId: userId,
            },
          })

          if (prev) {
            const newRequest = {
              ...prev.checkForRequests,
              request: data?.newMessageRequest ?? false,
            }

            cache.writeQuery<
              IFetchUserRequestsResponse,
              IFetchUserRequestsVariables
            >({
              query: FETCH_USER_REQUESTS,
              variables: {
                toUserId: userId,
              },
              data: {
                checkForRequests: newRequest,
              },
            })
          }
        },
      })
    },
    [sendMessageRequest],
  )
  const onPressRetrieveMessageRequest = useCallback(
    async (requestId: number, userId: number) => {
      await retrieveMessageRequest({
        variables: {
          requestId,
        },
        update: (cache, { data }) => {
          const prev: IFetchUserRequestsResponse | null = cache.readQuery({
            query: FETCH_USER_REQUESTS,
            variables: {
              toUserId: userId,
            },
          })

          if (prev) {
            const newRequest = {
              ...prev.checkForRequests,
              request: data?.retrieveMessageRequest ? false : true,
            }

            cache.writeQuery<
              IFetchUserRequestsResponse,
              IFetchUserRequestsVariables
            >({
              query: FETCH_USER_REQUESTS,
              variables: {
                toUserId: userId,
              },
              data: {
                checkForRequests: newRequest,
              },
            })
          }
        },
      })
    },
    [retrieveMessageRequest],
  )

  const onPressFollowers = useCallback(() => {
    navigate(Routes.Followers, {
      userId: user.data?.getUser.id ?? 0,
      username: user.data?.getUser.username ?? '',
    })
  }, [user.data?.getUser.id, user.data?.getUser.username])

  return (
    <Page>
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
                  <View row>
                    <Text textColor header fontGilroy>
                      {user.data?.getUser.username}
                    </Text>
                  </View>
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

      <View row marginT-20 paddingR-30>
        {localUser?.id !== user.data?.getUser.id && (
          <Button
            padding-5
            marginL-15
            style={{ width: '50%' }}
            primary={!isFollowing.data?.userFollowsActor}
            outline={!isFollowing.data?.userFollowsActor}
            outlineColor={Colors.primary}
            label={
              isFollowing.data?.userFollowsActor ? 'Takipten çık' : 'Takip et'
            }
            onPress={
              !isFollowing.data?.userFollowsActor
                ? () => onPressFollow(user.data?.getUser.id ?? 0)
                : () => onPressUnfollow(user.data?.getUser.id ?? 0)
            }
            avoidInnerPadding
            labelStyle={{ ...Typography.font12 }}
            loading={
              followUserMeta.loading ||
              unfollowUserMeta.loading ||
              isFollowing.loading
            }
          />
        )}

        {localUser?.id !== user.data?.getUser.id && (
          <Button
            padding-5
            outline={requestedMessage.data?.checkForRequests?.request}
            outlineColor={Colors.primary}
            primary={
              requestedMessage.data?.checkForRequests?.request ? true : false
            }
            style={{ width: '50%' }}
            marginL-15
            label={
              !requestedMessage.data?.checkForRequests?.request
                ? 'Mesaj Gönder'
                : 'Mesaj isteğini geri al'
            }
            onPress={
              !requestedMessage.data?.checkForRequests?.request
                ? () => onPressSendMessageRequest(user.data?.getUser.id ?? 0)
                : () =>
                    onPressRetrieveMessageRequest(
                      requestedMessage.data?.checkForRequests?.id ?? 0,
                      user.data?.getUser.id ?? 0,
                    )
            }
            loading={
              retrieveMessageRequestMeta.loading ||
              sendMessageRequestMeta.loading ||
              requestedMessage.loading
            }
            avoidInnerPadding
            labelStyle={{ ...Typography.font12 }}
          />
        )}
      </View>

      <View row margin-15 marginT-50 spread>
        <View>
          <Text text textColor center style={{ width: 55 }}>
            {user.data?.getUser._count.posts} Gönderi
          </Text>
        </View>
        <View>
          <TouchableOpacity onPress={onPressFollowers}>
            <Text text textColor center style={{ width: 55 }}>
              {user.data?.getUser._count.followers} Takipçi
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={onPressFollowers}>
            <Text text textColor center>
              {user.data?.getUser._count.followings}
            </Text>

            <Text text textColor center>
              Takip Edilen
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View flex>
        <TabController items={tabItems} asCarousel>
          <TabController.TabBar
            activeBackgroundColor={Colors.surfaceBG}
            backgroundColor={Colors.trueSurfaceBG}
            labelColor={Colors.textColor}
            containerWidth={350}
            centerSelected
          />
          <TabController.PageCarousel>
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
          </TabController.PageCarousel>
        </TabController>
      </View>
    </Page>
  )
}
