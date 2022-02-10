import { ChatComponent } from '@/components/Chat/Chat.component'
import { useSocket } from '@/hooks/useSocket'
import { useWebrtc } from '@/hooks/useWebrtc'
import { INavigatorParamsList, Routes } from '@/navigators/navigator.props'
import { navigateBack } from '@/navigators/utils/navigation'
import {
  ICallMadeResponse,
  SocketListenerEvents,
} from '@/services/socket.types'
import { useAppSelector } from '@/store'
import { IMessage } from '@/types/messages.types'
import { showToast, ToastStatus } from '@/utils/toast'
import { wait } from '@/utils/utils'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { DeviceEventEmitter } from 'react-native'
import InCallManager from 'react-native-incall-manager'
import { SafeAreaView } from 'react-native-safe-area-context'
export function MatchChatContainer() {
  const {
    params: { user, room, uuid },
  } = useRoute<RouteProp<INavigatorParamsList, Routes.MatchChat>>()
  const [inCall, setInCall] = useState<boolean>(false)

  const [message, setMessage] = useState<string>('')
  const [typing, setTyping] = useState<boolean>(false)
  const [messages, setMessages] = useState<IMessage[]>([
    //@ts-ignore
    { message: 'Merhaba!' },
  ])
  const ref = useRef()
  const localUser = useAppSelector(state => state.userReducer.user)
  const navigation = useNavigation()
  const { socket: socketService } = useSocket()
  const rtc = useWebrtc()

  const answerCall = useCallback(
    async (data: ICallMadeResponse) => {
      const stream = await rtc.getUserMedia({ audio: true, video: false })
      rtc.addStream(stream)
      const answer = await rtc.createAnswer(data.offer)

      socketService.makeAnswer(answer, data.uuid)
    },
    [rtc, socketService],
  )

  const rejectCall = useCallback(async () => {}, [])

  const retrieveCall = useCallback(async () => {
    socketService.retrieveCall(uuid)
  }, [socketService, uuid])

  const speakerToggled = useCallback(async () => {
    InCallManager.setSpeakerphoneOn(true)
  }, [])

  const micToggled = useCallback(async () => {
    rtc.peerConnection
      .getLocalStreams()
      .forEach(stream => (stream.active = false))
  }, [rtc])
  const callEnded = useCallback(async () => {
    rtc.peerConnection.getLocalStreams().forEach(stream => stream.release())
    rtc.peerConnection.close()
    setInCall(false)
    showToast(ToastStatus.Info, 'Çağrı sonlandırıldı.')
    navigateBack()
  }, [rtc])

  useEffect(() => {
    DeviceEventEmitter.addListener('callAccepted', answerCall)
    DeviceEventEmitter.addListener('callRejected', rejectCall)
    DeviceEventEmitter.addListener('callRetrieved', retrieveCall)
    DeviceEventEmitter.addListener('speakerToggled', speakerToggled)
    DeviceEventEmitter.addListener('micToggled', micToggled)
    DeviceEventEmitter.addListener('callEnded', callEnded)

    socketService.joinRoom({
      room,
    })

    socketService.messageReceivedEvent(_message => {
      setMessages(prev => [...prev, _message.message])
    })

    socketService.userIsTypingEvent(_typing => {
      setTyping(prev => !prev && _typing.typing)
    })

    socketService.userIsDoneTypingEvent(_typing => {
      setTyping(false)
    })

    socketService.messageRemovedEvent(resp => {
      setMessages(prev => prev.filter(m => m.id !== resp.messageId))
    })

    socketService.callRetrievedEvent(() => {
      DeviceEventEmitter.emit('callIsRetrieved')
    })

    rtc.peerConnection.onicecandidate = e => {
      if (e.candidate) {
        socketService.addIceCandidate(e.candidate, uuid)
      }
    }

    socketService.iceCandidateReceivedEvent(async data => {
      if (data.candidate)
        await rtc.peerConnection.addIceCandidate(data.candidate)
    })

    socketService.callMadeEvent(data => {
      navigation.navigate(Routes.CallComing, {
        offer: data.offer,
        uuid: data.uuid,
        username: user.username,
      })
    })

    socketService.answerMadeEvent(async data => {
      await rtc.setRemoteDescription(data.answer)
      DeviceEventEmitter.emit('callAcceptedCloseCallingModal')
    })

    rtc.peerConnection.onconnectionstatechange = () => {
      if (rtc.peerConnection.connectionState === 'connected') {
        setInCall(true)
      } else if (rtc.peerConnection.connectionState === 'closed') {
        setInCall(false)
      } else if (rtc.peerConnection.connectionState === 'disconnected') {
        setInCall(false)
      } else {
        setInCall(false)
      }
    }

    return () => {
      socketService.removeListeners([
        SocketListenerEvents.MessageReceived,
        SocketListenerEvents.Typing,
        SocketListenerEvents.DoneTyping,
        SocketListenerEvents.RemoveMessageRequested,
        SocketListenerEvents.CallMade,
        SocketListenerEvents.AnswerMade,
        SocketListenerEvents.CallIsRetrieved,
        SocketListenerEvents.ReceivedIceCandidate,
      ])
      DeviceEventEmitter.removeAllListeners('callAccepted')
      DeviceEventEmitter.removeAllListeners('callRejected')
      DeviceEventEmitter.removeAllListeners('callRetrieved')
      DeviceEventEmitter.removeAllListeners('callEnded')
      rtc.peerConnection.close()
    }
  }, [
    answerCall,
    navigation,
    rejectCall,
    retrieveCall,
    room,
    rtc,
    socketService,
    user.username,
    uuid,
    callEnded,
  ])

  useEffect(() => {
    if (inCall) {
      InCallManager.start()
    } else {
      InCallManager.stop()
    }

    return () => {
      InCallManager.stop()
    }
  }, [inCall])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [navigation])

  const sendMessage = useCallback(() => {
    if (message.length < 1) {
      showToast(ToastStatus.Error, 'Lütfen bir mesaj giriniz.')
      return
    }

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

  const onCall = useCallback(async () => {
    const stream = await rtc.getUserMedia({ audio: true, video: false })
    rtc.addStream(stream)
    const offer = await rtc.createOffer()
    navigation.navigate(Routes.Calling, {
      username: user.username,
      avatar: user.avatar,
    })

    wait(1000).then(() => {
      socketService.callUser(offer, uuid)
    })
  }, [rtc, socketService, uuid, user, navigation])

  return (
    <SafeAreaView>
      <ChatComponent
        callFunction={!user.blockIncomingCalls}
        isOnline
        ref={ref}
        inCall={inCall}
        username={user.username}
        avatar={user.avatar}
        onChangeInputText={onChangeText}
        onPressSend={sendMessage}
        messages={messages}
        message={message}
        userId={user.id}
        onPressCall={onCall}
        onPressBack={navigateBack}
        typing={typing}
        onBlurInput={onBlurInput}
        onPressRemove={messageId => removeMessage(messageId)}
      />
    </SafeAreaView>
  )
}
