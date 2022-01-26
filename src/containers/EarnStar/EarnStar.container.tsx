import Button from '@/components/Button/Button.component'
import { Icon } from '@/components/Icon/Icon.component'
import { Page } from '@/components/Page/Page.component'
import { Surface } from '@/components/Surface/Surface.component'
import {
  FETCH_USER_STARS,
  IFetchUserStarsResponse,
} from '@/graphql/queries/User.query'
import { useAppSelector } from '@/store'
import { wait } from '@/utils/utils'
import { useQuery } from '@apollo/client'
import { useNavigation } from '@react-navigation/native'
import AnimatedLottieView from 'lottie-react-native'
import React, { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useCallback } from 'react'
import { Colors } from 'react-native-ui-lib'
import Text from 'react-native-ui-lib/text'
import View from 'react-native-ui-lib/view'

export function EarnStarContainer() {
  const navigation = useNavigation()
  const animationRef = useRef<AnimatedLottieView>(null)
  const theme = useAppSelector(state => state.themeReducer.theme)
  const animationBgTheme = useMemo(
    () => (theme === 'dark' ? Colors.black : Colors.white),
    [theme],
  )
  const { data } = useQuery<IFetchUserStarsResponse>(FETCH_USER_STARS, {
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    wait(250).then(() => animationRef.current?.play())
  }, [])

  const headerRight = useCallback(() => {
    return (
      <View row>
        <Icon name="sparkles" color="#FEB200" size={25} />
        <Text yellow fontGilroy font17 marginL-10 marginT-6>
          {data?.getUserStars.starCount}
        </Text>
      </View>
    )
  }, [data])

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
        colorFilters={[
          {
            keypath: '**',
            color: animationBgTheme,
          },
        ]}
        ref={animationRef}
      />

      <Text fontGilroyBold font28>
        Yıldız Kazan!
      </Text>
      <Text fontSfProRegular font16 marginT-10>
        Video izle anında 1 yıldız kazan. Yıldızlar insanlar ile eşleşmende
        işine yara.
      </Text>

      <Surface
        row
        padding-20
        marginT-30
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
          <Text center fontSfProRegular font16 textColor>
            Hemen izle, kazan!
          </Text>
          <Button
            marginT-10
            label="1"
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
      </Surface>
    </Page>
  )
}
