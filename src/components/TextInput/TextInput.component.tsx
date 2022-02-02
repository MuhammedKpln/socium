import React from 'react'
import { Colors, Incubator } from 'react-native-ui-lib'
import TextInputStyle from './TextInput.style'

const { TextField } = Incubator

interface IProps {
  backgroundColor?: string
}

export const TextInput = (
  props: IProps & Incubator.TextFieldProps,

  //@ts-ignore
) => {
  return (
    <TextField
      padding-20
      fieldStyle={[
        TextInputStyle.input,
        props?.backgroundColor
          ? { backgroundColor: props.backgroundColor }
          : { backgroundColor: Colors.surfaceBG },
      ]}
      color={Colors.textColor}
      {...props}
    />
  )
}
