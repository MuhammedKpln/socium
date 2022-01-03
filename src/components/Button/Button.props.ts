import { ButtonProps } from 'react-native-ui-lib'

export type IButtonProps = ButtonProps & _IButtonProps

interface _IButtonProps {
  loading?: boolean
}
