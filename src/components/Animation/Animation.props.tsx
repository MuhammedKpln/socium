import { AnimatedLottieViewProps } from 'lottie-react-native'

type LottieProps = Exclude<AnimatedLottieViewProps, 'source'>

export interface IAnimationCPProps extends LottieProps {
  animationName: string
}
