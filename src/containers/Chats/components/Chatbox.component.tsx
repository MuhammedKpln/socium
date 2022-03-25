import { Avatar } from '@/components/Avatar/Avatar.component'
import { Badge } from '@/components/Badge/Badge.component'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import Text from 'react-native-ui-lib/text'
import View from 'react-native-ui-lib/view'

interface IProps {
  name: string
  lastMessage: string
  date: Date
  avatar: string
  onPress: () => void
  renderBadge: boolean
}

export function ChatBox(props: IProps) {
  const { name, lastMessage, date, avatar, onPress, renderBadge } = props
  return (
    <TouchableOpacity onPress={onPress}>
      <View bg-trueSurfaceBG paddingV-5>
        <View spread row>
          <View row left>
            {renderBadge ? (
              <View marginT-20 marginR-10>
                <Badge size={15} />
              </View>
            ) : null}

            <Avatar userAvatar={avatar} size={53} />
            <View marginL-10>
              <Text textColor fontSfProMedium font15>
                {name}
              </Text>
              <Text fontSfProRegular font13 greyText={!renderBadge} marginT-5>
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
