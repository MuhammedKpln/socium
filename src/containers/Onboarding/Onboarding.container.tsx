import { Config } from '@/config'
import { Routes } from '@/navigators/navigator.props'
import { navigateAndSimpleReset } from '@/navigators/utils/navigation'
import { fetchAvatars, setFirstStart } from '@/store/reducers/app.reducer'
import React, { useMemo, useState } from 'react'
import { useWindowDimensions } from 'react-native'
import PagerView from 'react-native-pager-view'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, Colors, Text, View } from 'react-native-ui-lib'
import { useDispatch } from 'react-redux'
import { StartupStyles } from './Startup.styles'

export const OnboardingContainer = () => {
  const safeArea = useSafeAreaInsets()
  const [index, setIndex] = useState<number>(0)
  const window = useWindowDimensions()
  const dispatch = useDispatch()

  const pages = useMemo(() => {
    const Logo = React.memo(require('@/assets/images/logo.svg').default)
    const ServerDown = React.memo(
      require('@/assets/images/ServerDown.svg').default,
    )
    const Talk = React.memo(require('@/assets/images/Talk.svg').default)
    const PhoneCall = React.memo(
      require('@/assets/images/Listener.svg').default,
    )
    const World = React.memo(require('@/assets/images/world.svg').default)

    const onPressLogin = () => {
      dispatch(fetchAvatars())
      dispatch(setFirstStart(true))
      navigateAndSimpleReset(Routes.Login)
    }

    const onPressContiune = () => {
      dispatch(fetchAvatars())
      dispatch(setFirstStart(true))
      navigateAndSimpleReset(Routes.App)
    }

    return [
      {
        backgroundColor: Colors.primary,
        image: <Logo width={200} height={200} />,
        title: Config.APP_TITLE,
        subtitle: `Hoşgeldiniz! ${Config.APP_SLOGAN}`,
      },
      {
        backgroundColor: '#D6E4FF',
        image: <ServerDown width={200} height={200} />,
        title: 'Anonim!',
        subtitle:
          'Tamamen anonim olarak karşınızdaki kişiyle dertleşin! Hiçbir sohbet sunucularımızda veya karşıdaki kişide kalmaz! 24 saat dolduğunda tamamen silinir',
      },
      {
        backgroundColor: '#F3FDD4',
        image: <Talk width={200} height={200} />,
        title: 'Eşleş!',
        subtitle:
          'Sohbet etmek için eşleşme sırasına katılın, rastgele biriyle eşleşin',
      },
      {
        backgroundColor: '#FEE8D2',
        image: <PhoneCall width={200} height={200} />,
        title: 'SESLİ KONUŞUN !',
        subtitle:
          'Mesajlaşmaktan yoruldunuz mu? Karşı tarafın isteği ile sesli konuşun!',
      },
      {
        backgroundColor: '#ffd9f0',
        image: <World width={200} height={200} />,
        title: 'KEŞFET!',
        subtitle:
          'Dertleşmek istediğin konuyu paylaşarak, insanların sana dertleşme isteği yollamasını sağla ',
      },
      {
        backgroundColor: Colors.primary,
        image: <Logo width={200} height={200} />,
        title: 'Hazır mısın?',
        subtitle: (
          <View style={{ width: '100%' }}>
            <Button onPress={onPressLogin} label="Kayıt ol" />
            <Text
              marginV-10
              font15
              style={{ alignSelf: 'center', color: Colors.grey600 }}
            >
              Yada..
            </Text>
            <Button
              link
              linkColor={Colors.primary}
              onPress={onPressContiune}
              label="Giriş yapmadan devam et"
            />
          </View>
        ),
      },
    ]
  }, [])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Text style={[StartupStyles.heading, { paddingTop: safeArea.top + 20 }]}>
        {Config.APP_TITLE}
      </Text>

      <PagerView
        initialPage={index}
        onPageSelected={e => setIndex(e.nativeEvent.position)}
        style={{
          flex: 1,
        }}
      >
        {pages.map((page, _index) => (
          <View key={_index} style={[StartupStyles.container]}>
            <View
              style={[
                StartupStyles.imageBackground,
                { backgroundColor: page.backgroundColor },
              ]}
            >
              {page.image}
            </View>
            <View style={StartupStyles.textContainer}>
              <Text
                style={[StartupStyles.title, { maxWidth: window.width - 100 }]}
              >
                {page.title}
              </Text>

              <Text
                style={[
                  StartupStyles.subtitle,
                  { maxWidth: window.width - 100 },
                ]}
              >
                {page.subtitle}
              </Text>
            </View>
          </View>
        ))}
      </PagerView>
      <View
        style={[
          StartupStyles.pagerContainer,
          { marginBottom: safeArea.bottom + 20 },
        ]}
      >
        {pages.map((_, i) => (
          <View
            key={i}
            style={[
              StartupStyles.pager,
              i === index ? StartupStyles.pagerActive : null,
            ]}
          />
        ))}
      </View>
    </SafeAreaView>
  )
}
