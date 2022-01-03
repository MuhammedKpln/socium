import { useAppSelector } from '@/store'
import React, { useMemo } from 'react'
import { Avatar } from '../Avatar/Avatar.component'
import { NoAvatar } from '../NoAvatar/NoAvatar.component'

export function HeaderRight() {
  const isLoggedIn = useAppSelector(state => state.userReducer.isLoggedIn)
  const user = useAppSelector(state => state.userReducer.user)
  const randomUsername = useMemo(() => {
    if (!isLoggedIn) {
      return Math.floor(Math.random() * 200).toString()
    }

    return ''
  }, [isLoggedIn])

  if (isLoggedIn) {
    if (user?.avatar) {
      return <Avatar userAvatar={user?.avatar} />
    } else {
      if (user) {
        return <NoAvatar username={user.username} />
      }
    }
  }

  return <NoAvatar username={randomUsername} />
}
