import {
  MatchBackgroundBlack,
  MatchBackgroundWhite,
} from '@/assets/images/MatchBackground'
import { useAppSelector } from '@/store'
import AnimatedLottieView from 'lottie-react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from 'react-native-ui-lib'
import Text from 'react-native-ui-lib/text'
import TouchableOpacity from 'react-native-ui-lib/touchableOpacity'
import View from 'react-native-ui-lib/view'

interface IProps {
  onPressMatch: () => void
}

export function MatchComponent(props: IProps) {
  const [isDark, setIsDark] = useState(false)
  const inAppTheme = useAppSelector(state => state.themeReducer.theme)

  useEffect(() => {
    if (inAppTheme === 'dark') {
      setIsDark(true)
    } else {
      setIsDark(false)
    }
  }, [inAppTheme])

  return (
    <View style={{ justifyContent: 'space-evenly' }}>
      {isDark ? (
        <MatchBackgroundBlack style={{ marginTop: -100 }} bg-surfaceBG />
      ) : (
        <MatchBackgroundWhite style={{ marginTop: -100 }} bg-surfaceBG />
      )}

      <View center style={{ marginTop: -50 }}>
        <TouchableOpacity onPress={props.onPressMatch}>
          <AnimatedLottieView
            source={require('@/assets/animations/match-screen-button')}
            autoPlay
            loop
            cacheStrategy="strong"
            style={{ width: 172, height: 172 }}
          />
        </TouchableOpacity>
        <Text
          fontGilroy
          style={{ marginTop: -90, color: Colors.white, fontSize: 17 }}
        >
          Hemen katıl
        </Text>

        <Text textColor header marginT-90 fontGilroy>
          Hemen sıraya gir,
        </Text>
        <Text textColor header fontGilroy>
          eşleymeyi yakala!
        </Text>
      </View>
    </View>
  )
}
