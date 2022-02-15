import { Avatar } from '@/components/Avatar/Avatar.component'
import Button from '@/components/Button/Button.component'
import { Icon } from '@/components/Icon/Icon.component'
import { Page } from '@/components/Page/Page.component'
import { INavigatorParamsList, Routes } from '@/navigators/navigator.props'
import { chatEmitter } from '@/services/events.service'
import { useAppSelector } from '@/store'
import { RouteProp, useRoute } from '@react-navigation/native'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { StyleSheet } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { Colors } from 'react-native-ui-lib'
import UIAvatar from 'react-native-ui-lib/avatar'
import Text from 'react-native-ui-lib/text'
import View from 'react-native-ui-lib/view'
dayjs.extend(relativeTime)

export function CallContainer() {
  const {
    params: { avatar, username, isMuted },
  } = useRoute<RouteProp<INavigatorParamsList, Routes.Call>>()
  const mic = useAppSelector(state => state.chatReducer.mic)
  const speakersOn = useAppSelector(state => state.chatReducer.speakersOn)
  const callTimer = useAppSelector(state => state.chatReducer.callTimer)
  const [receiverMicMuted, setReceiverMicMuted] = useState<boolean>(false)
  const speakerButtonStyles = useMemo(() => {
    return {
      width: 50,
      height: 50,
    }
  }, [])
  const micButtonStyles = useMemo(() => {
    return {
      width: 50,
      height: 50,
    }
  }, [])
  const avatarScale = useSharedValue(1)
  const avatarStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(avatarScale.value, {
            damping: 1500,
          }),
        },
      ],
    }
  })

  useEffect(() => {
    chatEmitter.addListener('micMuted', _isMuted => {
      setReceiverMicMuted(_isMuted)
    })

    const animationLoop = setInterval(() => {
      if (receiverMicMuted) return

      if (avatarScale.value == 0.9) {
        avatarScale.value = 1
      } else {
        avatarScale.value = 0.9
      }
    }, 600)

    return () => {
      clearInterval(animationLoop)
      chatEmitter.removeAllListeners('micMuted')
    }
  }, [avatarScale, receiverMicMuted, isMuted])

  const onPressSpeaker = useCallback(() => {
    chatEmitter.emit('speakerToggled')
  }, [])
  const onPressMic = useCallback(() => {
    chatEmitter.emit('micToggled')
  }, [])
  const callEnded = useCallback(() => {
    chatEmitter.emit('callEnded')
  }, [])

  return (
    <Page style={[styles.container]}>
      <View center>
        <Text textColor style={[styles.incomingCallText]}>
          {username}
        </Text>
        <Text greyText marginT-10>
          {receiverMicMuted || isMuted
            ? 'Kullanıcı mikrofonu kapalı.'
            : dayjs(callTimer).fromNow(true)}
        </Text>
      </View>

      <Animated.View style={avatarStyle}>
        {avatar ? (
          <Avatar userAvatar={avatar} size={200} />
        ) : (
          <UIAvatar label={username[0].toUpperCase()} size={200} />
        )}
      </Animated.View>

      <View bg-surfaceBG padding-20 width="100%">
        <View style={styles.actionButtons}>
          <Button
            round
            style={speakerButtonStyles}
            backgroundColor={!speakersOn ? Colors.orange50 : Colors.primary}
            iconSource={() => (
              <Icon name="speaker" size={23} color={Colors.white} />
            )}
            avoidInnerPadding
            onPress={onPressSpeaker}
          />
          <Button
            round
            style={micButtonStyles}
            backgroundColor={!mic ? Colors.orange50 : Colors.primary}
            iconSource={() => (
              <Icon name="mic" size={23} color={Colors.white} />
            )}
            avoidInnerPadding
            onPress={onPressMic}
          />
          <Button
            bg-red
            round
            style={{ width: 50, height: 50 }}
            iconSource={() => (
              <Icon name="phone-off" size={20} color={Colors.white} />
            )}
            avoidInnerPadding
            onPress={callEnded}
          />
        </View>
      </View>
    </Page>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 50,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  actionButtons: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },
  incomingCallText: {
    fontSize: 20,
    marginTop: 50,
  },
  descriptionText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 30,
  },
})
