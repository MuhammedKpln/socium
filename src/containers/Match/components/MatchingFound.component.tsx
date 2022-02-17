import { Avatar } from '@/components/Avatar/Avatar.component'
import Button from '@/components/Button/Button.component'
import { Icon } from '@/components/Icon/Icon.component'
import { matchEmitter } from '@/services/events.service'
import { IUser } from '@/types/login.types'
import { wait } from '@/utils/utils'
import AnimatedLottieView from 'lottie-react-native'
import React, { useCallback, useState } from 'react'
import { StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from 'react-native-ui-lib'
import Modal from 'react-native-ui-lib/modal'
import Text from 'react-native-ui-lib/text'
import View from 'react-native-ui-lib/view'

interface IProps {
  user: IUser
}

export function MatchingFoundComponent(props: IProps) {
  const { user } = props
  const [modalVisible, setModalVisible] = useState<boolean>(true)

  const onPressClose = useCallback(async () => {
    setModalVisible(false)
    await wait(100)
    matchEmitter.emit('rejectMatch')
  }, [])

  const onPressSendMessage = useCallback(async () => {
    setModalVisible(false)

    await wait(100)
    matchEmitter.emit('acceptMatch')
  }, [])

  return (
    <View>
      <StatusBar barStyle="dark-content" />
      <Modal
        visible={modalVisible}
        overlayBackgroundColor="rgba(0,0,0,0.9)"
        style={{ opacity: 0.5 }}
      >
        <SafeAreaView
          style={{
            flex: 1,
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
          }}
        >
          <View center>
            <Text fontGilroy font22 color={Colors.white}>
              Yeni bir eşleşme var!
            </Text>
            <View center>
              <AnimatedLottieView
                source={require('@/assets/animations/confetti')}
                autoPlay
                loop
                style={{ width: 300, height: 300 }}
              />
              <View style={{ marginTop: -190 }}>
                <Avatar userAvatar={user.avatar} size={155} />
              </View>
              <Text
                fontGilroy
                font22
                color={Colors.white}
                marginT-30
                marginL-20
              >
                {user.username}
              </Text>
            </View>

            <View marginT-200 center>
              <Button
                onPress={onPressSendMessage}
                iconSource={() => <Icon name="send" color="white" size={20} />}
                label="Mesaj Gönder"
                labelStyle={{
                  fontSize: 16,
                  marginLeft: 10,
                }}
              />
              <Button
                linkColor={Colors.white}
                link
                label="Kapat"
                marginT-30
                onPress={onPressClose}
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  )
}
