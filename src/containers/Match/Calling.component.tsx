import { Avatar } from '@/components/Avatar/Avatar.component'
import Button from '@/components/Button/Button.component'
import { Icon } from '@/components/Icon/Icon.component'
import { Page } from '@/components/Page/Page.component'
import { INavigatorParamsList, Routes } from '@/navigators/navigator.props'
import { navigateBack } from '@/navigators/utils/navigation'
import { chatEmitter } from '@/services/events.service'
import { showToast, ToastStatus } from '@/utils/toast'
import { RouteProp, useRoute } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'
import InCallManager from 'react-native-incall-manager'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Colors } from 'react-native-ui-lib'
import UIAvatar from 'react-native-ui-lib/avatar'
import Text from 'react-native-ui-lib/text'
import View from 'react-native-ui-lib/view'

export const Calling = () => {
  const { username, avatar } =
    useRoute<RouteProp<INavigatorParamsList, Routes.Calling>>().params
  const { bottom } = useSafeAreaInsets()
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

  const retrieveCall = () => {
    chatEmitter.emit('callRetrieved')
    navigateBack()
  }

  useEffect(() => {
    InCallManager.start({ media: 'audio', ringback: '_DEFAULT_' })
    chatEmitter.addListener('callAcceptedCloseCallingModal', () => {
      showToast(ToastStatus.Success, 'Arama kabul edildi!')
      navigateBack()
    })

    const interval = setInterval(() => {
      ReactNativeHapticFeedback.trigger('impactHeavy', {
        enableVibrateFallback: true,
      })
    }, 1000)
    const animationLoop = setInterval(() => {
      if (avatarScale.value == 0.9) {
        avatarScale.value = 1
      } else {
        avatarScale.value = 0.9
      }
    }, 600)

    return () => {
      InCallManager.stop()
      clearInterval(interval)
      clearInterval(animationLoop)
      chatEmitter.removeAllListeners('callAcceptedCloseCallingModal')
    }
  }, [avatarScale])

  return (
    <Page style={[styles.container]}>
      <View center>
        <Text textColor style={[styles.incomingCallText]}>
          {username}
        </Text>
        <Text greyText marginT-10>
          sesli konuşma başlatılıyor..
        </Text>
      </View>

      <Animated.View style={avatarStyle}>
        {avatar ? (
          <Avatar userAvatar={avatar} size={200} />
        ) : (
          <UIAvatar label={username[0].toUpperCase()} size={200} />
        )}
      </Animated.View>
      <Animated.View style={[styles.actionButtons, { paddingBottom: bottom }]}>
        <Button
          label="Aramayı iptal et"
          iconSource={() => (
            <Icon
              name="phone-off"
              color={Colors.white}
              style={{ marginRight: 10 }}
            />
          )}
          onPress={retrieveCall}
        />
      </Animated.View>
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
    alignItems: 'center',
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
