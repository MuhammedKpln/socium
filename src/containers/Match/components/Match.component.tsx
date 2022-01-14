import MatchBackground from '@/assets/images/MatchBackground'
import AnimatedLottieView from 'lottie-react-native'
import React from 'react'
import { TouchableHighlight } from 'react-native'
import { Colors, Text, TouchableOpacity, View } from 'react-native-ui-lib'

interface IProps {
  onPressMatch: () => void
}

export function MatchComponent(props: IProps) {
  return (
    <>
      <MatchBackground
        style={{
          shadowColor: '#ccc',
          shadowOffset: {
            width: 40,
            height: 50,
          },
          shadowOpacity: 0.58,
          shadowRadius: 16.0,

          elevation: 24,
        }}
      />
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
    </>
  )
}
