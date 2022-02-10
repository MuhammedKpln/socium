import { Icon } from '@/components/Icon/Icon.component'
import { Page } from '@/components/Page/Page.component'
import { INavigatorParamsList, Routes } from '@/navigators/navigator.props'
import { navigateBack } from '@/navigators/utils/navigation'
import { RouteProp, useRoute } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { DeviceEventEmitter, StyleSheet, Vibration } from 'react-native'
import InCallManager from 'react-native-incall-manager'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Colors, TouchableOpacity } from 'react-native-ui-lib'
import Avatar from 'react-native-ui-lib/avatar'
import Text from 'react-native-ui-lib/text'
import View from 'react-native-ui-lib/view'

export const CallComing = () => {
  const { username, offer, uuid } =
    useRoute<RouteProp<INavigatorParamsList, Routes.CallComing>>().params
  const { bottom } = useSafeAreaInsets()

  const onCallAccepted = () => {
    DeviceEventEmitter.emit('callAccepted', { offer, uuid })
    navigateBack()
  }

  const onCallRejected = () => {
    DeviceEventEmitter.emit('callRejected')
    navigateBack()
  }

  useEffect(() => {
    DeviceEventEmitter.addListener('callIsRetrieved', () => {
      navigateBack()
    })
    InCallManager.startRingtone()
    Vibration.vibrate([50, 100, 200, 300, 400], true)

    return () => {
      InCallManager.stopRingtone()
      Vibration.cancel()
      DeviceEventEmitter.removeAllListeners('callIsRetrieved')
    }
  }, [])

  return (
    <Page style={[styles.container]}>
      <Avatar label={username[0].toUpperCase()} />
      <Text textColor style={[styles.incomingCallText]}>
        {username}
      </Text>
      <Text greyText marginT-10>
        sesli konuşma isteği yolladı
      </Text>

      <View style={[styles.actionButtons, { paddingBottom: bottom }]}>
        <TouchableOpacity onPress={onCallAccepted}>
          <View width={60} height={60} br100 bg-green30 center>
            <Icon name="phone-call" color={Colors.white} size={20} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={onCallRejected}>
          <View width={60} height={60} br100 bg-red30 center>
            <Icon name="phone-off" color={Colors.white} size={20} />
          </View>
        </TouchableOpacity>
      </View>
    </Page>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  userEmoji: {
    width: 150,
    height: 150,
    position: 'absolute',
    top: 270,
  },
  actionButtons: {
    position: 'absolute',
    bottom: 30,
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
