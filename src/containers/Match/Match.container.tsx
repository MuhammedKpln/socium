import Button from '@/components/Button/Button.component'
import { Page } from '@/components/Page/Page.component'
import { useSocket } from '@/hooks/useSocket'
import { Routes } from '@/navigators/navigator.props'
import { useAppSelector } from '@/store'
import { IUser } from '@/types/login.types'
import { wait } from '@/utils/utils'
import { useNavigation } from '@react-navigation/native'
import AnimatedLottieView from 'lottie-react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { Assets } from 'react-native-ui-lib'
import Text from 'react-native-ui-lib/text'
import View from 'react-native-ui-lib/view'
import { MatchComponent } from './components/Match.component'

export function MatchContainer() {
  const [matching, setMatching] = useState<boolean>(false)
  const [matched, setMatched] = useState<boolean>(false)
  const [connectedUser, setConnectedUser] = useState<IUser>()
  const [connectedUuid, setConnectedUuid] = useState<string>('')
  const [room, setRoom] = useState<string>('')
  const navigation = useNavigation()
  const marginBottom = useSharedValue(0)
  const opacity = useSharedValue(1)
  const localUser = useAppSelector(state => state.userReducer.user)
  const { socket: socketService } = useSocket()
  const animationRef = useRef<AnimatedLottieView>(null)

  useEffect(() => {
    socketService.clientPairedEvent(data => {
      setRoom(data.room)
      setConnectedUser(data.user)
      setConnectedUuid(data.uuid)
      setMatched(true)
      marginBottom.value = 0

      opacity.value = 1
    })
  }, [marginBottom, opacity, socketService])

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      marginBottom: withTiming(marginBottom.value, {
        duration: 400,
      }),
    }
  })
  const matchComponentStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, {
        duration: 600,
      }),
    }
  })

  const onPressMatch = useCallback(() => {
    marginBottom.value = 0
    opacity.value = 0

    wait(700).then(async () => {
      if (localUser) {
        socketService.joinQueue({
          user: localUser,
        })
        setMatching(true)
      }
    })
  }, [marginBottom, opacity, localUser, socketService])

  const resetState = useCallback(() => {
    setMatched(false)
    setMatching(false)
    setConnectedUser(undefined)
    setConnectedUuid('')
  }, [])

  useEffect(() => {
    if (matched && connectedUser) {
      wait(100).then(() => {
        resetState()
        navigation.navigate(Routes.MatchingFound, {
          room,
          uuid: connectedUuid,
          user: connectedUser,
        })
      })
    }
  }, [matched, navigation, connectedUser, room, connectedUuid, resetState])

  const leaveQueue = useCallback(() => {
    socketService.leaveQueue()
    setMatching(false)
    marginBottom.value = 0
    opacity.value = 1
  }, [marginBottom, opacity, socketService])

  return (
    <Page animated center>
      <Animated.View style={containerAnimatedStyle}>
        {!matching ? (
          <Animated.View style={matchComponentStyle}>
            <MatchComponent onPressMatch={() => onPressMatch()} />
          </Animated.View>
        ) : (
          <View flex spread>
            <Text fontGilroy style={{ fontSize: 22 }}>
              Eşleşme bekleniyor...
            </Text>

            <AnimatedLottieView
              source={Assets.animations.paperPlane}
              ref={animationRef}
              autoPlay
              loop
            />

            <Button label="Eşleşmeden ayrıl" onPress={leaveQueue} />
          </View>
        )}
      </Animated.View>
    </Page>
  )
}
