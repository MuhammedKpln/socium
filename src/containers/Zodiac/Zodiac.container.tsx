import { Icon } from '@/components/Icon/Icon.component'
import { LoaderScreen } from '@/components/LoaderScreen/LoaderScreen.component'
import type { INavigatorParamsList, Routes } from '@/navigators/navigator.props'
import { wait } from '@/utils/utils'
import { IZodiac, zodiacs } from '@/utils/zodiac'
import { RouteProp, useRoute } from '@react-navigation/native'
import { AnimatePresence } from 'framer-motion'
import _ from 'lodash'
import { MotiView, useAnimationState } from 'moti'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Dimensions, FlatList, StyleSheet } from 'react-native'
import FastImage from 'react-native-fast-image'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Assets } from 'react-native-ui-lib'
import Slider from 'react-native-ui-lib/slider'
import Text from 'react-native-ui-lib/text'
import TouchableOpacity from 'react-native-ui-lib/touchableOpacity'
import View from 'react-native-ui-lib/view'

export function ZodiacContainer() {
  const [appLoading, setAppLoading] = useState<boolean>(true)
  const zodiacList = useMemo<string[]>(() => Object.keys(zodiacs), [])
  const route = useRoute<RouteProp<INavigatorParamsList, Routes.Zodiac>>()
  const [currentZodiac, setCurrentZodiac] = useState<IZodiac | null>(
    route.params.currentZodiac,
  )
  const safeArea = useSafeAreaInsets()
  const listRef = useRef<FlatList>(null)
  const animationState = useAnimationState({
    from: {
      height: '0%',
    },
    to: {
      height: '100%',
    },
    active: {
      height: '100%',
    },
  })
  const infos = useMemo(() => {
    return [
      {
        title: 'Kariyer',
        value: _.random(1, 10, false),
      },
      {
        title: 'Aşk',
        value: _.random(1, 10, false),
      },
      {
        title: 'Aile',
        value: _.random(1, 10, false),
      },
      {
        title: 'İş',
        value: _.random(1, 10, false),
      },
      {
        title: 'Şans',
        value: _.random(1, 10, false),
      },
    ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentZodiac])

  useEffect(() => {
    wait(100).then(() => {
      listRef.current?.scrollToIndex({
        index: zodiacList.findIndex(v => v === currentZodiac?.name),
        animated: true,
      })
    })
  }, [currentZodiac?.name, zodiacList])

  const renderZodiacs = useCallback(
    ({ item }: { item: keyof typeof zodiacs }) => {
      const zodiac: IZodiac = zodiacs[item]

      return (
        <TouchableOpacity
          key={zodiac.name}
          onPress={() => {
            setCurrentZodiac(zodiac)
          }}
        >
          <View
            style={[
              {
                borderRadius: 50,

                borderLeftColor: '#fff',
                padding: 20,
              },
              currentZodiac?.name === zodiac.name && {
                shadowColor: '#1B1B58',
                shadowOffset: {
                  width: 0,
                  height: 5,
                },
                shadowOpacity: 0.3,
                shadowRadius: 4.65,

                elevation: 8,
              },
            ]}
          >
            <Icon
              name={zodiac.image}
              color={currentZodiac?.name === zodiac.name ? 'white' : '#2F303D'}
              size={50}
            />
          </View>
        </TouchableOpacity>
      )
    },
    [currentZodiac],
  )

  const renderQualifactionIcon = useCallback(() => {
    switch (currentZodiac?.qualification) {
      case 'Toprak':
        return <Icon name="soil" color="#4D55FF" size={20} />
      case 'Hava':
        return <Icon name="air" color="#4D55FF" size={20} />
      case 'Ateş':
        return <Icon name="fire" color="#4D55FF" size={20} />
      case 'Su':
        return <Icon name="water" color="#4D55FF" size={20} />
    }
  }, [currentZodiac?.qualification])

  if (appLoading) {
    return (
      <>
        <FastImage
          source={Assets.app.ZodiacBg}
          onLoad={() => setAppLoading(false)}
        />
        <LoaderScreen />
      </>
    )
  }

  return (
    <View style={{ flex: 1, justifyContent: 'space-between' }}>
      <FastImage
        source={Assets.app.ZodiacBg}
        style={[
          StyleSheet.absoluteFill,
          { height: Dimensions.get('window').height },
        ]}
      />
      <View style={{ padding: 20 }}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text white font28>
            {currentZodiac?.name}
          </Text>
          <Text white font17 greyText>
            {currentZodiac?.dateRange}
          </Text>
        </View>
        <AnimatePresence exitBeforeEnter>
          <FlatList
            //@ts-ignore
            data={zodiacList}
            renderItem={renderZodiacs}
            horizontal
            ref={listRef}
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            centerContent
            snapToAlignment="center"
          />
        </AnimatePresence>
      </View>
      <MotiView
        state={animationState}
        delay={500}
        style={{
          backgroundColor: '#02030F',
          width: '100%',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: 20,
          paddingBottom: safeArea.bottom,
        }}
      >
        <View row style={{ alignItems: 'center' }}>
          <Text white font17 marginR-10 fontGilroy style={{ color: '#A7A7B2' }}>
            {renderQualifactionIcon()} {currentZodiac?.qualification},
          </Text>
          <Text white font17 fontGilroy marginT-7 style={{ color: '#A7A7B2' }}>
            {currentZodiac?.qualificationTitle}
          </Text>
        </View>
        <Text
          white
          font15
          margin-10
          fontSfProRegular
          style={{ color: '#505061' }}
        >
          {currentZodiac?.zodiacAbout}
        </Text>
        <Text color="#81828B" fontGilroy font17>
          <Icon name="sparkles" color="#4D55FF" size={20} /> Özellikler:
        </Text>
        <Text
          white
          font15
          margin-10
          fontSfProRegular
          style={{ color: '#505061' }}
        >
          {currentZodiac?.about}
        </Text>

        <View
          center
          marginT-20
          style={{
            maxWidth: '100%',
          }}
        >
          {infos.map(info => (
            <View
              row
              margin-10
              style={{ justifyContent: 'center' }}
              key={info.title}
            >
              <Text white font15 marginR-10>
                {info.title}
              </Text>
              <Slider
                value={info.value}
                minimumValue={0}
                maximumValue={10}
                minimumTrackTintColor={'#4D55FF'}
                maximumTrackTintColor={'#15162F'}
                thumbStyle={{ position: 'absolute', top: 10000 }}
                containerStyle={{
                  width: '50%',
                  marginTop: -5,
                }}
              />
            </View>
          ))}
        </View>
      </MotiView>
    </View>
  )
}
