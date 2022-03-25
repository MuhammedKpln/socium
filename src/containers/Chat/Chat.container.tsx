import { ChatComponent } from '@/components/Chat/Chat.component'
import { MARK_ALL_MESSAGES_READ } from '@/graphql/mutations/MarkAllMessagesRead.mutation'
import {
  FETCH_ROOM_MESSAGES,
  IFetchRoomMessagesResponse,
  IFetchRoomMessagesVariables,
} from '@/graphql/queries/FetchMessages.query'
import { useSocket } from '@/hooks/useSocket'
import type { INavigatorParamsList, Routes } from '@/navigators/navigator.props'
import { navigateBack } from '@/navigators/utils/navigation'
import { chatEmitter } from '@/services/events.service'
import { SocketListenerEvents } from '@/services/socket.types'
import { useAppSelector } from '@/store'
import { avatarStatic } from '@/utils/static'
import { useMutation, useQuery } from '@apollo/client'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { ActivityIndicator } from 'react-native'
import { ChatEmitter } from 'react-native-chatty'
import type {
  IMessage,
  ListRef,
} from 'react-native-chatty/lib/typescript/src/types/Chatty.types'

export function ChatContainer() {
  const {
    params: { room, user },
  } = useRoute<RouteProp<INavigatorParamsList, Routes.Chat>>()
  const navigation = useNavigation()
  const ref = useRef<ListRef>()
  const message = useRef<string>('')
  const localUser = useAppSelector(state => state.userReducer.user)
  const [messages, setMessages] = useState<IMessage[]>([])
  const { socket: socketService } = useSocket()
  const [replyingTo, setReplyingTo] = useState<IMessage | undefined>()
  const messagesResponse = useQuery<
    IFetchRoomMessagesResponse,
    IFetchRoomMessagesVariables
  >(FETCH_ROOM_MESSAGES, {
    variables: {
      roomId: room.id,
    },
    fetchPolicy: 'network-only',
    onCompleted: data => {
      const _messages: IMessage[] = []

      data.messagesFromRoom.forEach(_message => {
        const __message: IMessage = {
          id: _message.id,
          text: _message.message,
          user: {
            id: _message.sender.id,
            username: _message.sender.username,
            avatar: { uri: avatarStatic(_message.sender.avatar) },
          },
          createdAt: _message.created_at,
          me:
            _message?.sender?.id === localUser?.id ||
            _message?.senderId === localUser?.id,
        }

        _messages.push(__message)
      })

      setMessages(_messages)
    },
  })

  const [markAllMessagesRead] = useMutation<
    { markAllMessagesRead: boolean },
    { roomId: number }
  >(MARK_ALL_MESSAGES_READ)

  useEffect(() => {
    socketService.joinRoom({ room: room.roomAdress })

    socketService.messageReceivedEvent(_message => {
      console.log(_message)

      setMessages(prev =>
        prev.concat({
          id: _message.message.id,
          text: _message.message.message,
          user: {
            id: _message.message.senderId,
            username: 'selam',
          },
          createdAt: _message.message.created_at,
          me: _message.message.senderId === localUser?.id,
          repliedTo: _message.message.repliedToMessage && {
            id: _message.message.repliedToMessage?.id,
            createdAt: _message.message.repliedToMessage?.created_at,
            me: false,
            text: _message.message.repliedToMessage?.message,
            user: {
              id: _message.message.repliedToMessage?.senderId,
              username: _message.message.repliedToMessage?.sender.username,
            },
          },
        }),
      )
    })

    socketService.userIsTypingEvent(_typing => {
      ref.current?.setIsTyping(_typing.typing)
    })

    socketService.userIsDoneTypingEvent(_typing => {
      ref.current?.setIsTyping(false)
    })

    socketService.messageRemovedEvent(resp => {
      ref.current?.removeMessage(resp.messageId)
    })

    markAllMessagesRead({
      variables: {
        roomId: room.id,
      },
    })

    return () => {
      ChatEmitter.removeAllListeners()
      socketService.removeListeners([
        SocketListenerEvents.MessageReceived,
        SocketListenerEvents.DoneTyping,
        SocketListenerEvents.Typing,
        SocketListenerEvents.RemoveMessageRequested,
      ])
    }
  }, [
    messagesResponse.client.cache,
    room.id,
    room.roomAdress,
    socketService,
    localUser?.id,
    markAllMessagesRead,
  ])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })

    return () => {
      navigation.setOptions({
        headerShown: true,
      })
    }
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
      message: message.current,
      receiver: user,
      user: localUser,
      repliedToId: replyingTo?.id,
    })

    chatEmitter.emit('cleanTextInputValue')
    message.current = ''
    socketService.typing(false, room.roomAdress)
    setReplyingTo(undefined)
  }, [message, room, user, localUser, socketService, replyingTo])

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

      message.current = text
      chatEmitter.emit('textInputValue', text)
    },
    [room, socketService],
  )

  const removeMessage = useCallback(
    (messageId: number) => {
      socketService.removeMessage(messageId, room.roomAdress)
    },
    [room, socketService],
  )

  if (messages.length < 1) return <ActivityIndicator />

  return (
    <ChatComponent
      isOnline={true}
      avatar={user.avatar}
      username={user.username}
      userId={user.id}
      messages={messages}
      callFunction={false}
      onPressBack={() => navigateBack()}
      onTopReached={fetchOlderMessages}
      onPressSend={sendMessage}
      onPressRemove={removeMessage}
      onChangeInputText={onChangeText}
      onBlurInput={onBlurInput}
      onReply={setReplyingTo}
      replyingTo={replyingTo}
      ref={ref}
    />
  )
}
