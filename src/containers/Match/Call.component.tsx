import { Avatar } from '@/components/Avatar/Avatar.component'
import Button from '@/components/Button/Button.component'
import { Icon } from '@/components/Icon/Icon.component'
import { Page } from '@/components/Page/Page.component'
import { INavigatorParamsList, Routes } from '@/navigators/navigator.props'
import { RouteProp, useRoute } from '@react-navigation/native'
import React, { useCallback, useEffect } from 'react'
import { DeviceEventEmitter, StyleSheet } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { Colors } from 'react-native-ui-lib'
import UIAvatar from 'react-native-ui-lib/avatar'
import Text from 'react-native-ui-lib/text'
import View from 'react-native-ui-lib/view'

export function CallContainer() {
  const {
    params: { avatar, username },
  } = useRoute<RouteProp<INavigatorParamsList, Routes.Call>>()
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
    const animationLoop = setInterval(() => {
      if (avatarScale.value == 0.9) {
        avatarScale.value = 1
      } else {
        avatarScale.value = 0.9
      }
    }, 600)

    return () => {
      clearInterval(animationLoop)
    }
  }, [avatarScale])

  const onPressSpeaker = useCallback(() => {
    DeviceEventEmitter.emit('speakerToggled')
  }, [])
  const onPressMic = useCallback(() => {
    DeviceEventEmitter.emit('micToggled')
  }, [])
  const callEnded = useCallback(() => {
    DeviceEventEmitter.emit('callEnded')
  }, [])

  return (
    <Page style={[styles.container]}>
      <View center>
        <Text textColor style={[styles.incomingCallText]}>
          {username}
        </Text>
        <Text greyText marginT-10>
          sesli konuşma devam ediyor..
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
            style={{ width: 50, height: 50 }}
            iconSource={() => (
              <Icon name="speaker" size={23} color={Colors.white} />
            )}
            avoidInnerPadding
            onPress={onPressSpeaker}
          />
          <Button
            round
            style={{ width: 50, height: 50 }}
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
