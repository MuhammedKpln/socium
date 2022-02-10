import { ChatComponent } from '@/components/Chat/Chat.component'
import {
  FETCH_ROOM_MESSAGES,
  IFetchRoomMessagesResponse,
  IFetchRoomMessagesVariables,
} from '@/graphql/queries/FetchMessages.query'
import { useSocket } from '@/hooks/useSocket'
import { INavigatorParamsList, Routes } from '@/navigators/navigator.props'
import { navigateBack } from '@/navigators/utils/navigation'
import { useAppSelector } from '@/store'
import { wait } from '@/utils/utils'
import { useQuery } from '@apollo/client'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export function ChatContainer() {
  const {
    params: { room, user },
  } = useRoute<RouteProp<INavigatorParamsList, Routes.Chat>>()
  const navigation = useNavigation()
  const ref = useRef()
  const [typing, setTyping] = useState<boolean>(false)
  const [message, setMessage] = useState('')
  const localUser = useAppSelector(state => state.userReducer.isLoggedIn)
  const socketService = useSocket()
  const messagesResponse = useQuery<
    IFetchRoomMessagesResponse,
    IFetchRoomMessagesVariables
  >(FETCH_ROOM_MESSAGES, {
    variables: {
      roomId: room.id,
    },
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    socketService
      .connect()
      .then(async () => {
        await wait(700)

        socketService.joinRoom({ room: room.roomAdress })

        socketService.messageReceivedEvent(_message => {
          const prevResults: IFetchRoomMessagesResponse =
            messagesResponse.client.cache.readQuery({
              query: FETCH_ROOM_MESSAGES,
              variables: {
                roomId: room.id,
              },
            })

          messagesResponse.client.cache.writeQuery({
            query: FETCH_ROOM_MESSAGES,
            variables: {
              roomId: room.id,
            },
            data: {
              messagesFromRoom: [
                ...prevResults.messagesFromRoom,
                _message.message,
              ],
            },
          })
        })

        socketService.userIsTypingEvent(_typing => {
          setTyping(prev => !prev && _typing.typing)
        })

        socketService.userIsDoneTypingEvent(_typing => {
          setTyping(false)
        })

        socketService.messageRemovedEvent(resp => {
          const prevResults: IFetchRoomMessagesResponse =
            messagesResponse.client.cache.readQuery({
              query: FETCH_ROOM_MESSAGES,
              variables: {
                roomId: room.id,
              },
            })

          messagesResponse.client.cache.writeQuery({
            query: FETCH_ROOM_MESSAGES,
            variables: {
              roomId: room.id,
            },
            data: {
              messagesFromRoom: prevResults.messagesFromRoom.filter(
                v => v.id !== resp.messageId,
              ),
            },
          })
        })
      })
      .catch(err => console.error(err))
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [navigation])

  const fetchOlderMessages = useCallback(() => {
    return messagesResponse.fetchMore({
      variables: {
        roomId: room.id,
        offset: messagesResponse.data?.messagesFromRoom.length,
      },
    })
  }, [messagesResponse, room])

  const sendMessage = useCallback(() => {
    socketService.sendMessage({
      room: room.roomAdress,
      message,
      receiver: user,
      //@ts-ignore
      user: localUser,
    })

    setMessage('')
    socketService.typing(false, room.roomAdress)

    //@ts-ignore
    ref.current?.scrollToEnd({ animated: true })
  }, [message, room, user, localUser, socketService])

  const onBlurInput = useCallback(() => {
    socketService.typing(false, room.roomAdress)
  }, [room, socketService])

  const onChangeText = useCallback(
    (text: string) => {
      if (!socketService.isTyping) {
        socketService.isTyping = true
        socketService.typing(true, room.roomAdress)
      }

      if (text.length < 1) {
        socketService.isTyping = false
        socketService.typing(false, room.roomAdress)
      }

      setMessage(text)
    },
    [room, socketService],
  )

  const removeMessage = useCallback(
    (messageId: number) => {
      console.log('QWEQWEQWE', messageId)
      socketService.removeMessage(messageId, room.roomAdress)
    },
    [room, socketService],
  )

  return (
    <SafeAreaView>
      <ChatComponent
        isOnline={true}
        typing={typing}
        avatar={user.avatar}
        username={user.username}
        userId={user.id}
        messages={messagesResponse.data?.messagesFromRoom ?? ['we']}
        callFunction={false}
        onPressBack={() => navigateBack()}
        onTopReached={fetchOlderMessages}
        onPressSend={sendMessage}
        onPressRemove={removeMessage}
        message={message}
        onChangeInputText={onChangeText}
        onBlurInput={onBlurInput}
        ref={ref}
      />
    </SafeAreaView>
  )
}
