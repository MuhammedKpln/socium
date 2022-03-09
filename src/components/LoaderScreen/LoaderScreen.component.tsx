import RNLoaderScreen from 'react-native-ui-lib/loaderScreen'
import React from 'react'
import AnimatedLottieView from 'lottie-react-native'
import { Assets, LoaderScreenProps } from 'react-native-ui-lib'

export function LoaderScreen(props: LoaderScreenProps) {
  return (
    <RNLoaderScreen
      message="Yükleniyor.."
      overlay
      backgroundColor="rgba(0,0,0,0.8)"
      messageStyle={{ color: '#fff' }}
      customLoader={
        <AnimatedLottieView
          source={Assets.animations.paperPlane}
          style={{ width: 200, height: 200 }}
          autoPlay
          loop
        />
      }
      {...props}
    />
  )
}
