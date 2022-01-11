import { Routes } from '@/navigators/navigator.props'
import { navigate } from '@/navigators/utils/navigation'
import { useAppSelector } from '@/store'
import { authRequiredFunction } from '@/utils/auth'
import React, { useCallback, useMemo } from 'react'
import { TouchableOpacity } from 'react-native'
import { Avatar } from '../Avatar/Avatar.component'
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

  if (isLoggedIn) {
    if (user?.avatar) {
      return (
        <TouchableOpacity onPress={() => authRequiredFunction(onPressAvatar)}>
          <Avatar userAvatar={user?.avatar} />
        </TouchableOpacity>
      )
    } else {
      if (user) {
        return <NoAvatar username={user.username} />
      }
    }
  }

  return (
    <TouchableOpacity onPress={() => authRequiredFunction(onPressAvatar)}>
      <NoAvatar username={randomUsername} />
    </TouchableOpacity>
  )
})
