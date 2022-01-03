import React from 'react'
import { Incubator } from 'react-native-ui-lib'
import TextInputStyle from './TextInput.style'

const { TextField } = Incubator

export const TextInput = (
  props: Incubator.TextFieldProps & {
    useCustomTheme?: boolean | undefined
  },
  //@ts-ignore
) => {
  return <TextField fieldStyle={TextInputStyle.input} {...props} />
}
