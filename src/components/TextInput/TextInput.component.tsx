import React, { Ref } from 'react'
import type { TextInput as RNTextInput } from 'react-native'
import { Colors, Incubator } from 'react-native-ui-lib'
import TextInputStyle from './TextInput.style'

const { TextField } = Incubator

interface IProps {
  backgroundColor?: string
}

export const _TextInput = (
  props: IProps & Incubator.TextFieldProps,
  ref: Ref<RNTextInput>,
) => {
  return (
    <TextField
      padding-20
      //@ts-ignore
      ref={ref}
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

export const TextInput = React.forwardRef(_TextInput)
