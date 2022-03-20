import Button from '@/components/Button/Button.component'
import { Icon } from '@/components/Icon/Icon.component'
import { Page } from '@/components/Page/Page.component'
import { Surface } from '@/components/Surface/Surface.component'
import { Config } from '@/config'
import { ADD_NEW_STAR } from '@/graphql/mutations/Star.mutation'
import { useAppSelector } from '@/store'
import {
  updateShowNextAd,
  updateStarCount,
} from '@/store/reducers/user.reducer'
import type { IStar } from '@/types/login.types'
import { showToast, toastRef, ToastStatus } from '@/utils/toast'
import { wait } from '@/utils/utils'
import { useMutation } from '@apollo/client'
import { useRewardedAd } from '@react-native-admob/admob'
import { useNavigation } from '@react-navigation/native'
import dayjs from 'dayjs'
import AnimatedLottieView from 'lottie-react-native'
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Colors } from 'react-native-ui-lib'
import Text from 'react-native-ui-lib/text'
import View from 'react-native-ui-lib/view'
import { useDispatch } from 'react-redux'
import {
  getTrackingStatus,
  requestTrackingPermission,
} from 'react-native-tracking-transparency'
import { Platform } from 'react-native'
import { Toast } from '@/components/Toast/Toast.component'

export function EarnStarContainer() {
  const starCount = useAppSelector(state => state.userReducer.starCount)
  const showNextAd = useAppSelector(state => state.userReducer.showNextAd)
  const dispatch = useDispatch()
  const [nextAd, setNextAd] = useState<number>()

  const navigation = useNavigation()
  const animationRef = useRef<AnimatedLottieView>(null)
  const theme = useAppSelector(state => state.themeReducer.theme)
  const animationBgTheme = useMemo(
    () => (theme === 'dark' ? Colors.black : Colors.white),
    [theme],
  )
  const { adLoaded, reward, show, load, adDismissed } = useRewardedAd(
    Config.ADMOB_UNIT_ID,
  )
  const [addNewStar] = useMutation<{ addNewStar: IStar }>(ADD_NEW_STAR, {
    onCompleted: () => {
      showToast(ToastStatus.Success, '1 Yıldız Kazandınız!')
      const nextTimeDate = dayjs().add(1, 'hour')

      dispatch(updateShowNextAd(nextTimeDate.toDate()))

      setNextAd(nextTimeDate.diff(Date.now(), 'minutes', false))

      dispatch(updateStarCount(starCount + 1))
    },
  })

  useEffect(() => {
    wait(250).then(() => animationRef.current?.play())

    if (Platform.OS === 'ios' && Number(Platform.Version) >= 14) {
      getTrackingStatus().then(status => {
        if (
          status === 'not-determined' ||
          status === 'unavailable' ||
          status === 'restricted'
        ) {
          requestTrackingPermission()
          load()
        }
      })
    }
  }, [load])

  useEffect(() => {
    if (showNextAd) {
      const dateFromStorage = async () => {
        try {
          const date = dayjs(showNextAd)
          const dateNow = dayjs(Date.now())

          setNextAd(date.diff(dateNow, 'minutes', false))
        } catch (err) {
          return
        }
      }

      dateFromStorage()
    }
    load()
  }, [showNextAd, dispatch, load])

  useEffect(() => {
    if (reward && !adDismissed) {
      addNewStar()

      return
    }
  }, [reward, adDismissed, addNewStar])

  const onPressEarnStar = useCallback(() => {
    if (adLoaded) {
      show()
    } else {
      showToast(ToastStatus.Info, 'Yükleniyor lütfen bekleyiniz..')
    }
  }, [adLoaded, show])

  const headerRight = useCallback(() => {
    return (
      <View row>
        <Icon name="sparkles" color="#FEB200" size={25} />
        <Text yellow fontGilroy font17 marginL-10 marginT-6>
          {starCount}
        </Text>
      </View>
    )
  }, [starCount])

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
        <View style={{ marginLeft: !nextAd ? 80 : 20 }}>
          <Text center fontSfProRegular font16 textColor>
            Hemen izle, kazan!
          </Text>

          {!nextAd ? (
            <Button
              marginT-10
              label="1"
              onPress={onPressEarnStar}
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
          ) : (
            <Button
              marginT-10
              label={nextAd + ' dakika sonra tekrar geliniz.'}
              backgroundColor={Colors.yellow}
              iconSource={() => <Icon name="sparkles" color="#fff" size={18} />}
            />
          )}
        </View>
      </Surface>
      <Toast ref={toastRef} />
    </Page>
  )
}
