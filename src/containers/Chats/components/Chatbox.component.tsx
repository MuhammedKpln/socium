import { Avatar } from '@/components/Avatar/Avatar.component'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Colors } from 'react-native-ui-lib'
import Text from 'react-native-ui-lib/text'
import View from 'react-native-ui-lib/view'

interface IProps {
  name: string
  lastMessage: string
  date: Date
  avatar: string
  onPress: () => void
}

export function ChatBox(props: IProps) {
  const { name, lastMessage, date, avatar, onPress } = props
  return (
    <TouchableOpacity onPress={onPress}>
      <View backgroundColor={Colors.white}>
        <View spread row>
          <View row left>
            <Avatar userAvatar={avatar} size={53} />
            <View marginL-10>
              <Text textColor fontSfProMedium font15>
                {name}
              </Text>
              <Text textColor fontSfProRegular font13 greyText marginT-5>
                {lastMessage}
              </Text>
            </View>
          </View>

          <View right row>
            <Text fontGilroyBold greyText>
              {date}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}
