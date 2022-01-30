import { Routes } from '@/navigators/navigator.props'
import { navigate } from '@/navigators/utils/navigation'
import React, { useCallback } from 'react'
import { TouchableOpacity } from 'react-native'
import { Text, View } from 'react-native-ui-lib'
import { Avatar } from '../Avatar/Avatar.component'
import { Icon } from '../Icon/Icon.component'

interface IProps {
  onPressBack: () => void
  avatar: string
  username: string
  status: boolean
}

export const ChatHeader = React.memo((props: IProps) => {
  const { onPressBack, avatar, username, status } = props

  const onPressProfile = useCallback(() => {
    navigate(Routes.MyProfile, {
      username,
    })
  }, [username])

  return (
    <View bg-trueSurfaceBG>
      <View row spread padding-20>
        <View row>
          <View marginR-50 marginT-10>
            <Icon name="left" size={20} onPress={onPressBack} />
          </View>
          <Avatar userAvatar={avatar} />
          <TouchableOpacity onPress={() => onPressProfile()}>
            <View marginL-15>
              <Text fontSfProSemibold font15 textColor>
                {username}
              </Text>
              <Text
                fontSfProRegular
                font13
                marginT-5
                green={status ? true : false}
                red={!status ? true : false}
              >
                <View
                  width={8}
                  height={8}
                  br100
                  bg-green={status ? true : false}
                  bg-red={!status ? true : false}
                ></View>
                {'  '}
                {status ? 'Çevrimiçi' : 'Çevrimdışı'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View marginT-20>
          <Icon name="threedotslight" size={4} />
        </View>
      </View>
    </View>
  )
})
