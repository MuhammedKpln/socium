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
  FETCH_MESSAGES,
  FETCH_MESSAGE_REQUESTS,
  IFetchMessageRequestResponse,
  IFetchMessageRequestVariables,
  IFetchMessagesResponse,
  IFetchMessagesVariables,
} from '@/graphql/queries/FetchMessages.query'
import { Routes } from '@/navigators/navigator.props'
import { navigate } from '@/navigators/utils/navigation'
import { useAppSelector } from '@/store'
import { IUser } from '@/Types/login.types'
import { IMessage } from '@/types/messages.types'
import { showToast, ToastStatus } from '@/utils/toast'
import { useMutation, useQuery } from '@apollo/client'
import React, { useCallback } from 'react'
import { FlatList, RefreshControl } from 'react-native'
import { Colors } from 'react-native-ui-lib'
import Drawer from 'react-native-ui-lib/drawer'
import Text from 'react-native-ui-lib/text'
import View from 'react-native-ui-lib/view'
import { findBestMatch } from 'string-similarity'
import { ChatBox } from './components/Chatbox.component'
import { RecentlyMatched } from './components/RecentlyMatched.component'
import { Search } from './components/Search.component'
export function ChatsContainer() {
  const localUser = useAppSelector(state => state.userReducer.user)
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

      if (item.sender.id !== localUser?.id) {
        username = item.sender.username
        avatar = item.sender.avatar
      }
      if (item.receiver.id !== localUser?.id) {
        username = item.receiver.username
        avatar = item.receiver.avatar
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

  const renderData = useCallback(() => {
    return (
      <FlatList
        data={messages.data?.messages}
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
  }, [renderChatBox, messages, refreshControl])

  const onSearch = useCallback(
    (text: string) => {
      const prevResults = messages.previousData

      if (prevResults) {
        const updatedResults = prevResults.messages.filter(e => {
          const compare = findBestMatch(text.toLowerCase(), [
            e.sender.username.toLowerCase(),
            e.receiver.username.toLowerCase(),
          ])
          console.log(compare.bestMatch)

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
          <RecentlyMatched
            messageRequests={messageRequests.data.messageRequests}
            loading={messageRequests.loading}
          />
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
