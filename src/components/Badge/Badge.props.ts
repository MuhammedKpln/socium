import { ViewStyle } from 'react-native'
import { TextProps } from 'react-native-ui-lib'
import { IconProps } from 'react-native-vector-icons/Icon'

export interface IBadgeProps {
  iconName?: string
  label?: string
  size?: number
  backgroundColor?: string
  iconProps?: Omit<IconProps, 'name'>
  labelProps?: TextProps
  containerStyle?: ViewStyle
}
