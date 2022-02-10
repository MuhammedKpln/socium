import React from 'react'
import { Keyboard } from 'react-native'
import { Colors, Incubator } from 'react-native-ui-lib'
import Button from '../Button/Button.component'
import { Icon } from '../Icon/Icon.component'
import { IChatProps } from './Chat.props'

const { TextField } = Incubator

type IProps = Pick<
  IChatProps,
  'onPressSend' | 'onChangeInputText' | 'message' | 'onBlurInput'
>

export const ChatFooter = React.memo((props: IProps) => {
  return (
    <TextField
      onSubmitEditing={Keyboard.dismiss}
      placeholder="Mesaj gönderin"
      padding-10
      containerStyle={{
        padding: 10,
      }}
      fieldStyle={{
        backgroundColor: Colors.surfaceBG,
        borderRadius: 100,
        borderColor: Colors.getScheme() === 'dark' ? '#ADADAD' : '#FAFAFC',
        borderWidth: 1,
      }}
      onChangeText={props.onChangeInputText}
      value={props.message}
      onBlur={props.onBlurInput}
      placeholderTextColor="#ADADAD"
      trailingAccessory={
        <Button
          padding-10
          onPress={props.onPressSend}
          iconSource={() => (
            <Icon name="PaperPlane" size={20} color={Colors.white} />
          )}
        />
      }
    />
  )
})
