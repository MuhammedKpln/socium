import { Icon } from '@/components/Icon/Icon.component'
import React from 'react'
import { useMemo } from 'react'
import Text from 'react-native-ui-lib/text'
import View from 'react-native-ui-lib/view'
import { getZodiac } from '@/utils/zodiac'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useCallback } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Routes } from '@/navigators/navigator.props'

interface IProps {
  userBirthday: string | undefined
}

export default function UserZodiac(props: IProps) {
  const { userBirthday } = props
  const navigation = useNavigation()

  const userZodiac = useMemo(
    () => userBirthday && getZodiac(userBirthday),
    [userBirthday],
  )

  const onPressZodiac = useCallback(() => {
    if (!userZodiac) return

    navigation.navigate(Routes.Zodiac, {
      currentZodiac: userZodiac,
    })
  }, [navigation, userZodiac])

  if (!userZodiac) {
    return null
  }

  return (
    <TouchableOpacity onPress={onPressZodiac}>
      <View bg-primary padding-10 row br100 center style={{ maxWidth: '50%' }}>
        <Icon name={userZodiac.image} color="#FFF" size={15} />
        <Text white marginL-10 font15 fontSfProRegular>
          {userZodiac.name}
        </Text>
      </View>
    </TouchableOpacity>
  )
}
