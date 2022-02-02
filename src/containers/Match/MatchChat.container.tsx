import { ChatComponent } from '@/components/Chat/Chat.component'
import { useSocket } from '@/hooks/useSocket'
import { INavigatorParamsList, Routes } from '@/navigators/navigator.props'
import { navigateBack } from '@/navigators/utils/navigation'
import { useAppSelector } from '@/store'
import { IMessage } from '@/types/messages.types'
import { wait } from '@/utils/utils'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export function MatchChatContainer() {
  const {
    params: { user, room },
  } = useRoute<RouteProp<INavigatorParamsList, Routes.MatchChat>>()
  const [message, setMessage] = useState<string>('')
  const [typing, setTyping] = useState<boolean>(false)
  const [messages, setMessages] = useState<IMessage[]>([
    //@ts-ignore
    { message: 'Merhaba!' },
  ])
  const ref = useRef()
  const localUser = useAppSelector(state => state.userReducer.user)
  const navigation = useNavigation()
  const socketService = useSocket()

  useEffect(() => {
    socketService.connect().then(async () => {
      await wait(700)
      socketService.joinRoom({
        room,
      })

      socketService.messageReceivedEvent(_message => {
        setMessages(prev => [...prev, _message.message])
      })

      socketService.userIsTypingEvent(_typing => {
        console.log('EWQEQ', _typing)
        setTyping(prev => !prev && _typing.typing)
      })

      socketService.userIsDoneTypingEvent(_typing => {
        setTyping(false)
      })

      socketService.messageRemovedEvent(resp => {
        setMessages(prev => prev.filter(m => m.id !== resp.messageId))
      })
    })
  }, [socketService, room])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [navigation])

  const sendMessage = useCallback(() => {
    socketService.sendMessage({
      room,
      message,
      receiver: user,
      //@ts-ignore
      user: localUser,
    })

    setMessage('')
    socketService.typing(false, room)

    //@ts-ignore
    ref.current?.scrollToEnd({ animated: true })
  }, [message, room, user, localUser, socketService])

  const onBlurInput = useCallback(() => {
    socketService.typing(false, room)
  }, [room, socketService])

  const onChangeText = useCallback(
    (text: string) => {
      if (!socketService.isTyping) {
        socketService.isTyping = true
        socketService.typing(true, room)
      }

      if (text.length < 1) {
        socketService.isTyping = false
        socketService.typing(false, room)
      }

      setMessage(text)
    },
    [room, socketService],
  )

  const removeMessage = useCallback(
    (messageId: number) => {
      socketService.removeMessage(messageId, room)
    },
    [room, socketService],
  )

  return (
    <SafeAreaView>
      <ChatComponent
        callFunction
        isOnline
        ref={ref}
        username={user.username}
        avatar={user.avatar}
        onChangeInputText={onChangeText}
        onPressSend={sendMessage}
        messages={messages}
        message={message}
        userId={user.id}
        onPressBack={navigateBack}
        typing={typing}
        onBlurInput={onBlurInput}
        onPressRemove={messageId => removeMessage(messageId)}
      />
    </SafeAreaView>
  )
}
