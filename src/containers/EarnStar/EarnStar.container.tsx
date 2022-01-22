import Button from '@/components/Button/Button.component'
import { Icon } from '@/components/Icon/Icon.component'
import { Page } from '@/components/Page/Page.component'
import { wait } from '@/utils/utils'
import { useNavigation } from '@react-navigation/native'
import AnimatedLottieView from 'lottie-react-native'
import React, { useEffect, useLayoutEffect, useRef } from 'react'
import { useCallback } from 'react'
import { Colors } from 'react-native-ui-lib'
import Text from 'react-native-ui-lib/text'
import View from 'react-native-ui-lib/view'

export function EarnStarContainer() {
  const navigation = useNavigation()
  const animationRef = useRef<AnimatedLottieView>(null)

  useEffect(() => {
    wait(250).then(() => animationRef.current?.play())
  }, [])

  const headerRight = useCallback(() => {
    return (
      <View row>
        <Icon name="sparkles" color="#FEB200" size={25} />
        <Text yellow fontGilroy font17 marginL-10 marginT-6>
          100
        </Text>
      </View>
    )
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight,
    })
  }, [navigation, headerRight])

  return (
    <Page backgroundColor="#E5E5E5">
      <AnimatedLottieView
        source={require('@/assets/animations/stars')}
        autoPlay
        loop
        style={{ width: 375, height: 375 }}
        ref={animationRef}
      />

      <Text fontGilroyBold font28>
        Yıldız Kazan!
      </Text>
      <Text fontSfProRegular font16 marginT-10>
        Video izle anında 1 yıldız kazan. Yıldızlar insanlar ile eşleşmende
        işine yara.
      </Text>

      <View
        row
        padding-20
        marginT-30
        backgroundColor="#fff"
        br50
        width="100%"
        height={113}
        style={{
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 16.0,
        }}
      >
        <Icon
          name="film"
          color={Colors.yellow}
          size={32}
          style={{ marginTop: 20 }}
        />
        <View marginL-80>
          <Text center fontSfProRegular font16>
            Hemen izle, kazan!
          </Text>
          <Button
            marginT-10
            label="100"
            backgroundColor={Colors.yellow}
            iconSource={() => (
              <Icon
                name="sparkles"
                color="#fff"
                size={18}
                style={{ marginRight: 10 }}
              />
            )}
          />
        </View>
      </View>
    </Page>
  )
}
