import { ChatComponent } from '@/components/Chat/Chat.component'
import {
  FETCH_ROOM_MESSAGES,
  IFetchRoomMessagesResponse,
  IFetchRoomMessagesVariables,
} from '@/graphql/queries/FetchMessages.query'
import { INavigatorParamsList, Routes } from '@/navigators/navigator.props'
import { navigateBack } from '@/navigators/utils/navigation'
import { useQuery } from '@apollo/client'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback, useLayoutEffect, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export function ChatContainer() {
  const {
    params: { room, user },
  } = useRoute<RouteProp<INavigatorParamsList, Routes.Chat>>()
  const navigation = useNavigation()
  const ref = useRef()
  const messagesResponse = useQuery<
    IFetchRoomMessagesResponse,
    IFetchRoomMessagesVariables
  >(FETCH_ROOM_MESSAGES, {
    variables: {
      roomId: room.id,
    },
    fetchPolicy: 'network-only',
  })

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

  return (
    <SafeAreaView>
      <ChatComponent
        isOnline={true}
        typing={true}
        avatar={user.avatar}
        username={user.username}
        userId={user.id}
        messages={messagesResponse.data?.messagesFromRoom ?? ['we']}
        callFunction={false}
        onPressBack={() => navigateBack()}
        onTopReached={fetchOlderMessages}
        ref={ref}
      />
    </SafeAreaView>
  )
}
