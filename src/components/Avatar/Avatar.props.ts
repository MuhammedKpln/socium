import { AvatarProps } from 'react-native-ui-lib'

export interface IAvatarProps extends Omit<AvatarProps, 'size'> {
  userAvatar: string
  size?: number
}
