import { ChatComponent } from '@/components/Chat/Chat.component'
import { useSocket } from '@/hooks/useSocket'
import { useWebrtc } from '@/hooks/useWebrtc'
import { INavigatorParamsList, Routes } from '@/navigators/navigator.props'
import { navigateBack } from '@/navigators/utils/navigation'
import { chatEmitter } from '@/services/events.service'
import {
  ICallMadeResponse,
  SocketListenerEvents,
} from '@/services/socket.types'
import { useAppSelector } from '@/store'
import {
  resetChat,
  toggleMicMuted,
  toggleSpeakers,
} from '@/store/reducers/chat.reducer'
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
import { MessageStatus } from 'react-native-chatty'
import type {
  IMessage,
  ListRef,
} from 'react-native-chatty/lib/typescript/src/types/Chatty.types'
import InCallManager from 'react-native-incall-manager'
import { useDispatch } from 'react-redux'

export function MatchChatContainer() {
  const {
    params: { user, room, uuid },
  } = useRoute<RouteProp<INavigatorParamsList, Routes.MatchChat>>()
  const [inCall, setInCall] = useState<boolean>(false)
  const speakersOn = useAppSelector(state => state.chatReducer.speakersOn)
  const dispatch = useDispatch()
  const [message, setMessage] = useState<string>('')
  const [replyingTo, setReplyingTo] = useState<IMessage>()
  const [isReceiverMuted, setIsReceiverMuted] = useState<boolean>(false)
  const [messages, setMessages] = useState<IMessage[]>([
    //@ts-ignore
    {
      text: 'Merhaba!',
      me: false,
      createdAt: new Date(),
      id: 0,
      user: { id: 0, username: user.username },
      status: MessageStatus.Delivered,
    },
  ])
  const ref = useRef<ListRef>()
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
    if (speakersOn) {
      InCallManager.setForceSpeakerphoneOn(false)
    } else {
      InCallManager.setForceSpeakerphoneOn(true)
    }

    dispatch(toggleSpeakers())
  }, [dispatch, speakersOn])

  const micToggled = useCallback(async () => {
    const isMuted = rtc.localStream?.getAudioTracks()[0].enabled ? true : false

    socketService.muteMic({
      isMuted,
      uuid,
    })

    rtc.localStream?.getTracks().forEach(stream => {
      stream.enabled = !stream.enabled
    })

    dispatch(toggleMicMuted())
  }, [rtc, dispatch, socketService, uuid])
  const callEnded = useCallback(
    async (navigate: boolean = true) => {
      rtc.close()
      setInCall(false)
      showToast(ToastStatus.Info, 'Çağrı sonlandırıldı.')

      if (navigate) {
        navigateBack()
      }
    },
    [rtc],
  )

  useEffect(() => {
    chatEmitter.addListener('callAccepted', answerCall)
    chatEmitter.addListener('callRejected', rejectCall)
    chatEmitter.addListener('callRetrieved', retrieveCall)
    chatEmitter.addListener('speakerToggled', speakerToggled)
    chatEmitter.addListener('micToggled', micToggled)
    chatEmitter.addListener('callEnded', callEnded)

    socketService.joinRoom({
      room,
    })

    socketService.messageReceivedEvent(_message => {
      setMessages(prev => [
        ...prev,
        {
          id: _message.message.id ?? 0,
          text: _message.message.message,
          user: {
            id: _message.message.senderId,
            username: _message.message.sender.username,
            avatar: 'https://i.pravatar.cc/300',
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
        },
      ])
    })

    socketService.userIsTypingEvent(_typing => {
      ref.current?.setIsTyping(true)
    })

    socketService.userIsDoneTypingEvent(_typing => {
      ref.current?.setIsTyping(false)
    })

    socketService.messageRemovedEvent(resp => {
      setMessages(prev => prev.filter(m => m.id !== resp.messageId))
    })

    socketService.callRetrievedEvent(() => {
      chatEmitter.emit('callIsRetrieved')
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

    socketService.micMutedEvent(data => {
      setIsReceiverMuted(data.isMuted)
      chatEmitter.emit('micMuted', data.isMuted)
    })

    socketService.answerMadeEvent(async data => {
      await rtc.setRemoteDescription(data.answer)
      chatEmitter.emit('callAcceptedCloseCallingModal')
    })

    rtc.peerConnection.onconnectionstatechange = () => {
      if (rtc.peerConnection.connectionState === 'connected') {
        setInCall(true)
      } else if (rtc.peerConnection.connectionState === 'closed') {
        callEnded(false)
      } else if (rtc.peerConnection.connectionState === 'disconnected') {
        callEnded(false)
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
        SocketListenerEvents.MicMuted,
      ])
      chatEmitter.removeAllListeners('callAccepted')
      chatEmitter.removeAllListeners('callRejected')
      chatEmitter.removeAllListeners('callRetrieved')
      chatEmitter.removeAllListeners('callEnded')
      chatEmitter.removeAllListeners('micToggled')
      chatEmitter.removeAllListeners('speakerToggled')
      rtc.close()
      dispatch(resetChat())
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
    micToggled,
    speakerToggled,
    dispatch,
    localUser?.id,
  ])

  useEffect(() => {
    if (inCall) {
      InCallManager.start()
    } else {
      dispatch(resetChat())
      InCallManager.stop()
    }

    return () => {
      InCallManager.stop()
    }
  }, [inCall, dispatch])

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

  const sendMessage = useCallback(() => {
    if (message.length < 1) {
      showToast(ToastStatus.Error, 'Lütfen bir mesaj giriniz.')
      return
    }

    socketService.sendMessage({
      room,
      message,
      receiver: user,
      user: localUser,
      repliedToId: replyingTo?.id,
    })

    setMessage('')
    setReplyingTo(undefined)
    socketService.typing(false, room)

    //@ts-ignore
    ref.current?.scrollToEnd({ animated: true })
  }, [message, room, user, localUser, socketService, replyingTo])

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
    <ChatComponent
      callFunction={!user.blockIncomingCalls}
      isOnline
      ref={ref}
      inCall={inCall}
      username={user.username}
      muted={isReceiverMuted}
      avatar={user.avatar}
      onChangeInputText={onChangeText}
      onPressSend={sendMessage}
      messages={messages}
      message={message}
      userId={user.id}
      onPressCall={onCall}
      onPressBack={navigateBack}
      onBlurInput={onBlurInput}
      onPressRemove={messageId => removeMessage(messageId)}
      replyingTo={replyingTo}
      onReply={_message => setReplyingTo(_message)}
    />
  )
}
