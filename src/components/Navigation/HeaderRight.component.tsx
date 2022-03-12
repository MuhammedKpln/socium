import { Routes } from '@/navigators/navigator.props'
import { navigate } from '@/navigators/utils/navigation'
import { useAppSelector } from '@/store'
import { authRequiredFunction } from '@/utils/auth'
import React, { useCallback } from 'react'
import { TouchableOpacity } from 'react-native'
import { View } from 'react-native-ui-lib'
import { Avatar } from '../Avatar/Avatar.component'
import { Icon } from '../Icon/Icon.component'
import { NoAvatar } from '../NoAvatar/NoAvatar.component'

export const HeaderRight = React.memo(function HeaderRight() {
  const isLoggedIn = useAppSelector(state => state.userReducer.isLoggedIn)
  const user = useAppSelector(state => state.userReducer.user)

  const onPressAvatar = useCallback(() => {
    navigate(Routes.MyProfile, {
      username: user?.username,
    })
  }, [user])

  const onPressStar = useCallback(() => {
    navigate(Routes.EarnStar, {})
  }, [])

  const onPressBell = useCallback(() => {
    navigate(Routes.Notifications, {})
  }, [])

  if (isLoggedIn) {
    if (user?.avatar) {
      return (
        <View row>
          <View marginT-5 row>
            <View marginR-10 marginT-3>
              <TouchableOpacity
                onPress={() => authRequiredFunction(onPressBell)}
              >
                <Icon name="bell" size={23} />
              </TouchableOpacity>
            </View>
            <View marginR-10>
              <TouchableOpacity
                onPress={() => authRequiredFunction(onPressStar)}
              >
                <Icon name="sparkles" color="#FEB200" size={25} />
              </TouchableOpacity>
            </View>
          </View>
          <Avatar
            userAvatar={user?.avatar}
            size={30}
            onPress={() => authRequiredFunction(onPressAvatar)}
          />
        </View>
      )
    } else {
      if (user) {
        return <NoAvatar />
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
        <NoAvatar />
      </TouchableOpacity>
    </View>
  )
})
