import Button from '@/components/Button/Button.component'
import { Dialog } from '@/components/Dialog/Dialog.component'
import { Icon } from '@/components/Icon/Icon.component'
import { TextInput } from '@/components/TextInput/TextInput.component'
import {
  IRegisterWithGoogleResponse,
  IRegisterWithGoogleVariables,
  REGISTER_WITH_GOOGLE,
} from '@/graphql/mutations/Auth.mutation'
import { Routes } from '@/navigators/navigator.props'
import { navigateAndSimpleReset } from '@/navigators/utils/navigation'
import { EncryptedStorageKeys, useStorage } from '@/storage'
import { updateLoginStatus } from '@/store/reducers/user.reducer'
import { ERROR_CODES, ERROR_CODES_RAW } from '@/types/error_codes'
import { handleApolloErrors } from '@/utils/apollo'
import { showToast, ToastStatus } from '@/utils/toast'
import { useMutation } from '@apollo/client'
import type { User } from '@react-native-google-signin/google-signin'
import React, { useState } from 'react'
import { useMemo } from 'react'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import * as Yup from 'yup'

interface IProps {
  visible: boolean
  googleOAuth: User | null
  onSuccess: () => void
}

export function GoogleSignIn(props: IProps) {
  const { visible, googleOAuth, onSuccess } = props
  const [username, setUsername] = useState<string>('')
  const [, saveAccessToken] = useStorage(EncryptedStorageKeys.AccessToken)
  const [, saveRefreshToken] = useStorage(EncryptedStorageKeys.RefreshToken)
  const [, saveAccessTokenExpireDate] = useStorage(
    EncryptedStorageKeys.AccessTokenExpireDate,
  )
  const dispatch = useDispatch()
  const formSchema = useMemo(() => {
    return Yup.object({
      username: Yup.string().required(
        'Lütfen geçerli bir kullanıcı adı giriniz',
      ),
    })
  }, [])
  const [registerUser, registerUserMeta] = useMutation<
    IRegisterWithGoogleResponse,
    IRegisterWithGoogleVariables
  >(REGISTER_WITH_GOOGLE)

  const onPressRegister = useCallback(async () => {
    const isValid = await formSchema.isValid({ username })

    if (!googleOAuth || !isValid) return

    await registerUser({
      variables: {
        email: googleOAuth.user.email,
        idToken: googleOAuth.idToken ?? '',
        username,
      },
      onCompleted: async data => {
        showToast(ToastStatus.Success, `Hoşgeldin ${googleOAuth.user.name}!`)
        dispatch(
          updateLoginStatus({
            isLoggedIn: true,
            user: data.registerWithGoogle.user,
          }),
        )

        saveAccessToken(data.registerWithGoogle.access_token)
        saveRefreshToken(data.registerWithGoogle.refresh_token)
        saveAccessTokenExpireDate(data.registerWithGoogle.expire_date)

        onSuccess()
        navigateAndSimpleReset(Routes.App)
      },
      onError: err => {
        const errorCode = handleApolloErrors(
          err,
          ERROR_CODES_RAW.USER_IS_ALREADY_REGISTERED,
        )
        showToast(
          ToastStatus.Error,
          'Lütfen daha sonra tekrar deneyiniz..',
          //@ts-ignore
          ERROR_CODES[errorCode],
        )
      },
    })
  }, [
    dispatch,
    formSchema,
    googleOAuth,
    onSuccess,
    registerUser,
    saveAccessToken,
    saveAccessTokenExpireDate,
    saveRefreshToken,
    username,
  ])

  return (
    <Dialog
      visible={visible}
      onDismiss={() => console.log('dismissed')}
      title="Lütfen bir kullanici adi belirtiniz."
      actions={
        <Button
          label="Kayıt ol"
          onPress={onPressRegister}
          loading={registerUserMeta.loading}
        />
      }
    >
      <TextInput
        placeholder="Kullanıcı adı"
        onChangeText={setUsername}
        leadingAccessory={<Icon name="Untitled" style={{ paddingRight: 10 }} />}
      />
    </Dialog>
  )
}
