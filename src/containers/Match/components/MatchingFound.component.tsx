import Button from '@/components/Button/Button.component'
import { Icon } from '@/components/Icon/Icon.component'
import { NoAvatar } from '@/components/NoAvatar/NoAvatar.component'
import AnimatedLottieView from 'lottie-react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from 'react-native-ui-lib'
import Modal from 'react-native-ui-lib/modal'
import Text from 'react-native-ui-lib/text'
import View from 'react-native-ui-lib/view'

interface IProps {
  onPressClose: () => void
}

export function MatchingFoundComponent(props: IProps) {
  const { onPressClose } = props
  return (
    <View>
      <Modal
        visible={true}
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
                <NoAvatar username="muhammed" size={155} />
              </View>
              <Text
                fontGilroy
                font22
                color={Colors.white}
                marginT-30
                marginL-20
              >
                Selin Yıldız
              </Text>
            </View>

            <View marginT-200 center>
              <Button
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
