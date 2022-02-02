import { Avatar } from '@/components/Avatar/Avatar.component'
import { Page } from '@/components/Page/Page.component'
import { Toast } from '@/components/Toast/Toast.component'
import {
  EDIT_PROFILE,
  IEditProfileResponse,
  IEditProfileVariables,
} from '@/graphql/mutations/EditProfile.mutations'
import { useAppSelector } from '@/store'
import { updateUser } from '@/store/reducers/user.reducer'
import { avatarStatic } from '@/utils/static'
import { showToast, toastRef, ToastStatus } from '@/utils/toast'
import { useMutation } from '@apollo/client'
import { map } from 'lodash'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import FastImage from 'react-native-fast-image'
import { Colors } from 'react-native-ui-lib'
import View from 'react-native-ui-lib/view'
import { useDispatch } from 'react-redux'

export function ChangeAvatarContainer() {
  const dispatch = useDispatch()
  const currentAvatar = useAppSelector(state => state.userReducer.user?.avatar)
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar)
  const [editProfile] = useMutation<
    IEditProfileResponse,
    IEditProfileVariables
  >(EDIT_PROFILE)

  const avatars = useMemo(() => {
    const avatarName = 'avatar'
    const _avatars: string[] = []

    for (let index = 1; index < 54; index++) {
      _avatars.push(`${avatarName}${index}`)
    }

    return _avatars
  }, [])

  useEffect(() => {
    FastImage.preload([
      ...avatars.map(avatar => {
        return { uri: avatarStatic(avatar) }
      }),
    ])

    return () => {
      FastImage.clearMemoryCache()
    }
  }, [avatars])

  const selectAvatar = useCallback(
    async (avatar: string) => {
      setSelectedAvatar(avatar)
      showToast(ToastStatus.Info, 'Profil resmi değiştiriliyor...', {
        showLoader: true,
      })

      await editProfile({
        variables: {
          avatar,
        },
        update: (_, { data }) => {
          if (!data) return
          dispatch(updateUser(data?.editProfile))
        },
        onCompleted: () => {
          showToast(ToastStatus.Success, 'Profil resmi değiştirildi.')
        },
      })
    },
    [editProfile, dispatch],
  )

  return (
    <View flex>
      <Page scrollable>
        <View row style={{ flexGrow: 1, flexWrap: 'wrap' }}>
          {map(avatars, m => (
            <View margin-10>
              <View
                style={{
                  borderWidth: selectedAvatar === m ? 2 : 0,
                  borderColor: Colors.primary,
                }}
                br100
              >
                <Avatar
                  userAvatar={m}
                  size={60}
                  onPress={() => selectAvatar(m)}
                />
              </View>
            </View>
          ))}
        </View>
      </Page>
      <Toast ref={toastRef} />
    </View>
  )
}
