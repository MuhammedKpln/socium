import { Routes } from '@/navigators/navigator.props'
import { navigate } from '@/navigators/utils/navigation'
import { showToast, ToastStatus } from '@/utils/toast'
import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useEffect } from 'react'
import { TouchableOpacity } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { Colors } from 'react-native-ui-lib'
import Text from 'react-native-ui-lib/text'
import View from 'react-native-ui-lib/view'
import { Avatar } from '../Avatar/Avatar.component'
import Button from '../Button/Button.component'
import { Icon } from '../Icon/Icon.component'

interface IProps {
  onPressBack: () => void
  onPressCall?: () => void
  avatar: string
  username: string
  status: boolean
  callFunction?: boolean
  inCall?: boolean
}

export const ChatHeader = React.memo((props: IProps) => {
  const navigation = useNavigation()
  const {
    onPressBack,
    avatar,
    username,
    status,
    onPressCall,
    callFunction,
    inCall,
  } = props
  const buttonScale = useSharedValue(1)
  const buttonStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(buttonScale.value, {
            damping: 1500,
          }),
        },
      ],
    }
  })

  useEffect(() => {
    const animationLoop = setInterval(() => {
      if (buttonScale.value == 0.9) {
        buttonScale.value = 1
      } else {
        buttonScale.value = 0.9
      }
    }, 600)

    return () => {
      clearInterval(animationLoop)
    }
  }, [buttonScale])

  const _onPressCall = useCallback(() => {
    if (!callFunction) {
      showToast(
        ToastStatus.Error,
        'Bu kullanıcıyı arayabilmek için konuşma izni vermesi gerekmektedir.',
      )
    } else {
      if (onPressCall) onPressCall()
    }
  }, [callFunction, onPressCall])

  const onPressProfile = useCallback(() => {
    navigate(Routes.MyProfile, {
      username,
    })
  }, [username])

  const onPressCallBadge = useCallback(() => {
    navigation.navigate(Routes.Call, {
      avatar,
      username,
    })
  }, [navigation, avatar, username])

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
        {!inCall ? (
          <View marginT-10>
            <Icon name="phone-call" size={20} onPress={_onPressCall} />
          </View>
        ) : (
          <Animated.View style={buttonStyle}>
            <Button
              bg-green
              label={username}
              onPress={onPressCallBadge}
              enableShadow
              iconSource={() => (
                <Icon
                  name="phone-outgoing"
                  color={Colors.white}
                  size={14}
                  style={{ marginRight: 10 }}
                />
              )}
            />
          </Animated.View>
        )}
      </View>
    </View>
  )
})
