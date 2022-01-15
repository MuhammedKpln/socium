import { NoAvatar } from '@/components/NoAvatar/NoAvatar.component'
import React from 'react'
import Text from 'react-native-ui-lib/text'
import View from 'react-native-ui-lib/view'

export function ChatBox() {
  return (
    <View marginV-5 marginR-15>
      <View spread row>
        <View row left>
          <NoAvatar username="qwe" size={53} />
          <View marginL-10>
            <Text textColor fontSfProMedium font15>
              Cansu Yılmaz
            </Text>
            <Text textColor fontSfProRegular font13 greyText marginT-5>
              Certe, inquam, pertinazo non emolu...
            </Text>
          </View>
        </View>

        <View right row>
          <Text fontGilroyBold greyText>
            14:23
          </Text>
        </View>
      </View>
    </View>
  )
}
