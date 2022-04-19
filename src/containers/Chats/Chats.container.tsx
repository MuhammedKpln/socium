import { Icon } from '@/components/Icon/Icon.component'
import { NotFound } from '@/components/NotFound/NotFound.component'
import { Page } from '@/components/Page/Page.component'
import {
  SkeletonView,
  SkeletonViewContentTypes,
  SkeletonViewTemplates,
} from '@/components/SkeletonView/SkeletonView.component'
import {
  DELETE_ROOM,
  IDeleteRoomResponse,
  IDeleteRoomVariables,
} from '@/graphql/mutations/DeleteRoom.mutation'
import {
  ACCEPT_REQUEST,
  IAcceptRequestResponse,
  IAcceptRequestVariables,
  IRejectRequestResponse,
  IRejectRequestVariables,
  REJECT_REQUEST,
} from '@/graphql/mutations/Requests.mutation'
import {
  FETCH_MESSAGES,
  FETCH_MESSAGE_REQUESTS,
  IFetchMessageRequestResponse,
  IFetchMessageRequestVariables,
  IFetchMessagesResponse,
  IFetchMessagesVariables,
} from '@/graphql/queries/FetchMessages.query'
import {
  IMessageSendedSubscriptionResponse,
  IMessageSendedSubscriptionVariables,
  MESSAGE_SENDED_SUBSCRIPTION,
} from '@/graphql/subscriptions/MessageAdded.subscription'
import { Routes } from '@/navigators/navigator.props'
import { navigate } from '@/navigators/utils/navigation'
import { useAppSelector } from '@/store'
import type { IUser } from '@/Types/login.types'
import type { IMessage, IMessageRequests } from '@/types/messages.types'
import { showToast, ToastStatus } from '@/utils/toast'
import { useMutation, useQuery, useSubscription } from '@apollo/client'
import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FlatList, RefreshControl } from 'react-native'
import { Colors } from 'react-native-ui-lib'
import ActionSheet from 'react-native-ui-lib/actionSheet'
import Drawer from 'react-native-ui-lib/drawer'
import Text from 'react-native-ui-lib/text'
import View from 'react-native-ui-lib/view'
import Fader from 'react-native-ui-lib/fader'
import { findBestMatch } from 'string-similarity'
import type { IActionSheet } from './Chats.props'
import { ChatBox } from './components/Chatbox.component'
import { RecentlyMatched } from './components/RecentlyMatched.component'
import { Search } from './components/Search.component'

export function ChatsContainer() {
  const localUser = useAppSelector(state => state.userReducer.user)
  const navigator = useNavigation()
  const [showActionSheet, setShowActionSheet] = useState<IActionSheet>({
    visible: false,
    message: '',
    title: '',
    onAccept: () => null,
    onReject: () => null,
  })
  const messages = useQuery<IFetchMessagesResponse, IFetchMessagesVariables>(
    FETCH_MESSAGES,
    {
      fetchPolicy: 'network-only',
    },
  )
  const messageRequests = useQuery<
    IFetchMessageRequestResponse,
    IFetchMessageRequestVariables
  >(FETCH_MESSAGE_REQUESTS, {
    fetchPolicy: 'network-only',
  })

  const [acceptRequest] = useMutation<
    IAcceptRequestResponse,
    IAcceptRequestVariables
  >(ACCEPT_REQUEST)

  const [rejectRequest] = useMutation<
    IRejectRequestResponse,
    IRejectRequestVariables
  >(REJECT_REQUEST)

  useSubscription<
    IMessageSendedSubscriptionResponse,
    IMessageSendedSubscriptionVariables
  >(MESSAGE_SENDED_SUBSCRIPTION, {
    shouldResubscribe: true,
    fetchPolicy: 'network-only',
    variables: {
      userId: localUser?.id ?? 0,
    },
    onSubscriptionData: ({ client, subscriptionData }) => {
      const _messages: IFetchMessagesResponse | null = client.readQuery({
        query: FETCH_MESSAGES,
      })

      if (_messages) {
        const newMessage = subscriptionData.data?.messageSended
        const _ = [..._messages.messages]
        const index = _.findIndex(v => v.room.id === newMessage?.room.id)

        if (index !== -1 && newMessage) {
          _[index] = newMessage
        }

        client.writeQuery({
          query: FETCH_MESSAGES,
          data: {
            messages: _,
          },
        })
      }
    },
  })

  useEffect(() => {
    const listener = navigator.addListener('focus', () => {
      messages.refetch()
    })

    return () => {
      navigator.removeListener('focus', listener)
    }
  }, [messages, navigator])

  const [deleteRoom] = useMutation<IDeleteRoomResponse, IDeleteRoomVariables>(
    DELETE_ROOM,
    {
      update: (cache, { data: deletedRoom }) => {
        const prevResults = cache.readQuery<IFetchMessagesResponse>({
          query: FETCH_MESSAGES,
        })

        if (prevResults) {
          const updatedResults = prevResults.messages.filter(
            room => room.room.id !== deletedRoom?.deleteRoom.id,
          )

          cache.writeQuery<IFetchMessagesResponse>({
            query: FETCH_MESSAGES,
            data: {
              messages: updatedResults,
            },
          })
        }
      },
      onCompleted: () => {
        showToast(ToastStatus.Success, 'Mesaj silindi')
      },
    },
  )

  const onPressDelete = useCallback(
    (roomId: number) => {
      deleteRoom({
        variables: {
          roomId,
        },
      })
    },
    [deleteRoom],
  )

  const onPressChat = useCallback(
    (item: IMessage) => {
      let user: IUser
      if (item.sender.id !== localUser?.id) {
        user = item.sender
        navigate(Routes.Chat, { room: item.room, user })
      }
      if (item.receiver.id !== localUser?.id) {
        user = item.receiver
        navigate(Routes.Chat, { room: item.room, user })
      }
    },
    [localUser],
  )

  const renderChatBox = useCallback(
    ({ item }: { item: IMessage }) => {
      let username: string = ''
      let avatar: string = ''
      let renderBadge: boolean = false

      if (item.sender.id !== localUser?.id) {
        username = item.sender.username
        avatar = item.sender.avatar
      }
      if (item.receiver.id !== localUser?.id) {
        username = item.receiver.username
        avatar = item.receiver.avatar
      }

      if (item.receiver.id === localUser?.id && item.seen === false) {
        renderBadge = true
      }

      return (
        <View marginV-10 marginR-15>
          <Drawer
            bounciness={2}
            rightItems={[
              {
                customElement: (
                  <Icon name="trash" size={20} color={Colors.white} />
                ),
                background: Colors.backgroundDangerHeavy,
                onPress: () => onPressDelete(item.room.id ?? 0),
              },
            ]}
            useNativeAnimations
          >
            <ChatBox
              name={username}
              avatar={avatar}
              lastMessage={item.message}
              date={item.created_at}
              onPress={() => onPressChat(item)}
              renderBadge={renderBadge}
            />
          </Drawer>
        </View>
      )
    },
    [localUser, onPressDelete, onPressChat],
  )

  const refreshControl = useCallback(
    () => (
      <RefreshControl
        onRefresh={() => {
          messageRequests.refetch()
          messages.refetch()
        }}
        refreshing={messages.loading || messageRequests.loading}
      />
    ),
    [messages, messageRequests],
  )

  const renderSortedMessages = useMemo(() => {
    return messages.data?.messages.sort(a => {
      if (!a.seen) {
        return -1
      }
      return 1
    })
  }, [messages.data?.messages])

  const renderData = useCallback(() => {
    return (
      <FlatList
        data={renderSortedMessages}
        renderItem={renderChatBox}
        style={{ height: '100%' }}
        refreshControl={refreshControl()}
        ListEmptyComponent={
          <NotFound
            size={100}
            title="Hiç bir mesajınız yok."
            subtitle="Eşleşme sayfasına giderek yeni arkadaşlar elde edinebilirsiniz!"
          />
        }
      />
    )
  }, [renderChatBox, refreshControl, renderSortedMessages])

  const onSearch = useCallback(
    (text: string) => {
      const data = messages.data && messages.previousData

      if (data) {
        const updatedResults = data.messages.filter(e => {
          const compare = findBestMatch(text.toLowerCase(), [
            e.sender.username.toLowerCase(),
            e.receiver.username.toLowerCase(),
          ])
          if (compare.bestMatch.rating > 0.5) {
            return e
          }
        })

        if (text.length < 1) {
          messages.client.cache.writeQuery<IFetchMessagesResponse>({
            query: FETCH_MESSAGES,
            data: {
              messages: messages.previousData?.messages ?? [],
            },
          })
        } else {
          messages.client.cache.writeQuery<IFetchMessagesResponse>({
            query: FETCH_MESSAGES,
            data: {
              messages: updatedResults,
            },
          })
        }
      }
    },
    [messages],
  )

  const onPressRecentlyMatched = useCallback(
    (item: IMessageRequests) => {
      const onPressAccept = () => {
        acceptRequest({
          variables: {
            id: item.id,
            receiverId: item.requestFrom.id,
          },
          update: cache => {
            const prev = cache.readQuery<IFetchMessageRequestResponse>({
              query: FETCH_MESSAGE_REQUESTS,
            })

            if (prev) {
              const newData = prev.messageRequests.filter(v => v.id !== item.id)

              cache.writeQuery<IFetchMessageRequestResponse>({
                query: FETCH_MESSAGE_REQUESTS,
                data: {
                  messageRequests: newData,
                },
                overwrite: true,
              })
            }
          },
          onCompleted: async () => {
            showToast(ToastStatus.Success, 'Mesaj isteği kabul edildi')
            await messages.refetch()
          },
        })
      }
      const onPressReject = () => {
        rejectRequest({
          variables: {
            id: item.id,
          },
          update: cache => {
            const prev = cache.readQuery<IFetchMessageRequestResponse>({
              query: FETCH_MESSAGE_REQUESTS,
            })

            if (prev) {
              const newData = prev.messageRequests.filter(v => v.id !== item.id)

              cache.writeQuery<IFetchMessageRequestResponse>({
                query: FETCH_MESSAGE_REQUESTS,
                data: {
                  messageRequests: newData,
                },
              })
            }
          },
          onCompleted: async () => {
            showToast(ToastStatus.Success, 'Mesaj isteği reddedildi.')
            await messages.refetch()
          },
        })
      }

      setShowActionSheet({
        visible: true,
        title: item.requestFrom.username,
        message: `${item.requestFrom.username} isimli kullanıcının arkadaşlık isteğini kabul etmek istiyor musunuz?`,
        onAccept: onPressAccept,
        onReject: onPressReject,
      })
    },
    [acceptRequest, rejectRequest, messages],
  )

  return (
    <Page>
      <View margin-10>
        <Search onChangeText={onSearch} />
      </View>

      {!messageRequests.loading &&
      messageRequests.data?.messageRequests &&
      messageRequests.data?.messageRequests.length > 0 ? (
        <View marginT-20>
          <Text fontGilroyBold font17 textColor>
            Eşleşme istekleri
          </Text>
          <ActionSheet
            {...showActionSheet}
            options={[
              {
                label: 'Kabul et',
                onPress: showActionSheet.onAccept,
              },
              {
                label: 'Reddet',
                onPress: showActionSheet.onReject,
              },
              {
                label: 'İptal',
              },
            ]}
            destructiveButtonIndex={1}
            cancelButtonIndex={2}
            useNativeIOS
            onDismiss={() =>
              setShowActionSheet(prev => ({ ...prev, visible: false }))
            }
          />

          <RecentlyMatched
            messageRequests={messageRequests.data.messageRequests}
            loading={messageRequests.loading}
            onPress={(item: IMessageRequests) => onPressRecentlyMatched(item)}
          />
          <Fader visible position={Fader.position.END} size={200} />
        </View>
      ) : null}

      <View marginV-30>
        <Text fontGilroyBold font17 textColor>
          Sohbetler
        </Text>
      </View>

      <View>
        <SkeletonView
          showContent={!messages.loading}
          renderContent={renderData}
          times={messages.data?.messages.length}
          template={SkeletonViewTemplates.LIST_ITEM}
          listProps={{
            contentType: SkeletonViewContentTypes.AVATAR,
          }}
        />
      </View>
    </Page>
  )
}
