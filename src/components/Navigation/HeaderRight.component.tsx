import { Routes } from '@/navigators/navigator.props'
import { navigate } from '@/navigators/utils/navigation'
import { useAppSelector } from '@/store'
import { authRequiredFunction } from '@/utils/auth'
import React, { useCallback, useMemo } from 'react'
import { TouchableOpacity } from 'react-native'
import { View } from 'react-native-ui-lib'
import { Avatar } from '../Avatar/Avatar.component'
import { Icon } from '../Icon/Icon.component'
import { NoAvatar } from '../NoAvatar/NoAvatar.component'

export const HeaderRight = React.memo(function HeaderRight() {
  const isLoggedIn = useAppSelector(state => state.userReducer.isLoggedIn)
  const user = useAppSelector(state => state.userReducer.user)
  const randomUsername = useMemo(() => {
    if (!isLoggedIn) {
      return Math.floor(Math.random() * 200).toString()
    }

    return ''
  }, [isLoggedIn])

  const onPressAvatar = useCallback(() => {
    navigate(Routes.MyProfile, {
      username: user?.username,
    })
  }, [user])

  const onPressStar = useCallback(() => {
    navigate(Routes.EarnStar, {})
  }, [])

  if (isLoggedIn) {
    if (user?.avatar) {
      return (
        <View row>
          <View marginR-10>
            <TouchableOpacity onPress={() => authRequiredFunction(onPressStar)}>
              <Icon name="sparkles" color="#FEB200" size={25} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => authRequiredFunction(onPressAvatar)}>
            <Avatar userAvatar={user?.avatar} />
          </TouchableOpacity>
        </View>
      )
    } else {
      if (user) {
        return <NoAvatar username={user.username} />
      }
    }
  }

  return (
    <View row>
      <View marginR-10>
        <TouchableOpacity onPress={() => authRequiredFunction(onPressStar)}>
          <Icon name="sparkles" color="#FEB200" size={25} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => authRequiredFunction(onPressAvatar)}>
        <NoAvatar username={randomUsername} />
      </TouchableOpacity>
    </View>
  )
})
