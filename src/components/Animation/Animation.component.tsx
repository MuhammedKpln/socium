import React, { useEffect, useState } from 'react'
import Lottie from 'lottie-react-native'
import { ActivityIndicator } from 'react-native'
import { IAnimationCPProps } from './Animation.props'

const Animation = (props: IAnimationCPProps) => {
  const { animationName } = props
  const [animationData, setAnimationData] = useState<any>(null)

  useEffect(() => {
    import('@/assets/animations/match-screen-button.json').then(
      setAnimationData,
    )
  }, [animationName])

  if (!animationData) return <ActivityIndicator />
  return (
    <Lottie
      {...props}
      source={animationData}
      autoPlay
      loop
      cacheStrategy="strong"
    />
  )
}
export default Animation
