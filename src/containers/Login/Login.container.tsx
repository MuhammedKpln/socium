import Button from '@/components/Button/Button.component'
import { Page } from '@/components/Page/Page.component'
import { TextInput } from '@/components/TextInput/TextInput.component'
import {
  ILoginResponse,
  ILoginVariables,
  LOGIN,
} from '@/graphql/mutations/Auth.mutation'
import { Routes } from '@/navigators/navigator.props'
import { navigate, navigateAndSimpleReset } from '@/navigators/utils/navigation'
import { EncryptedStorageKeys, useStorage } from '@/storage'
import { ERROR_CODES, ERROR_CODES_RAW } from '@/types/error_codes'
import { handleApolloErrors } from '@/utils/apollo'
import { showToast, ToastStatus } from '@/utils/toast'
import { useMutation } from '@apollo/client'
import { Formik } from 'formik'
import React, { useMemo } from 'react'
import { Image, Text, View } from 'react-native-ui-lib'
import * as Yup from 'yup'

export function LoginContainer() {
  const [login] = useMutation<ILoginResponse, ILoginVariables>(LOGIN)
  const [, saveAccessToken] = useStorage(EncryptedStorageKeys.AccessToken)
  const [, saveRefreshToken] = useStorage(EncryptedStorageKeys.RefreshToken)
  const [, saveAccessTokenExpireDate] = useStorage(
    EncryptedStorageKeys.AccessTokenExpireDate,
  )
  const initialValues = useMemo(() => ({ email: '', password: '' }), [])
  const formValidationSchema = useMemo(
    () =>
      Yup.object({
        email: Yup.string().email().required(),
        password: Yup.string().required(),
      }),
    [],
  )

  async function onPressLogin(values: ILoginVariables) {
    return await login({
      variables: values,

      onError: e => {
        console.log('Qwe')
        const errorCode = handleApolloErrors(
          e,
          ERROR_CODES_RAW.USERNAME_OR_PASSWORD_INCORRECT,
        )

        if (errorCode) {
          showToast(ToastStatus.Error, ERROR_CODES[errorCode])
        } else {
          showToast(ToastStatus.Error, 'Lütfen daha sonra tekrar deneyiniz.')
        }
      },
      onCompleted: data => {
        if (!data.login.user.isEmailConfirmed) {
          showToast(ToastStatus.Error, 'Lütfen e-posta adresinizi doğrulayın.')
          saveAccessToken(data.login.access_token)
          saveRefreshToken(data.login.refresh_token)
          saveAccessTokenExpireDate(data.login.expire_date)

          navigateAndSimpleReset(Routes.EmailVerification)
        } else {
          showToast(
            ToastStatus.Success,
            `Hoşgeldin ${data.login.user.username}!`,
          )
          saveAccessToken(data.login.access_token)
          saveRefreshToken(data.login.refresh_token)
          saveAccessTokenExpireDate(data.login.expire_date)

          navigate(Routes.App, {})
        }
      },
    })
  }

  function onPressRegister() {
    navigate(Routes.Register, {})
  }

  return (
    <Page flex center>
      <Image assetName="logo" assetGroup="app" />
      <View marginV-100 width="100%">
        <Formik
          initialValues={initialValues}
          validationSchema={formValidationSchema}
          onSubmit={async values => await onPressLogin(values)}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            isValid,
            isSubmitting,
          }) => (
            <View>
              <View>
                <Text text70BL>E-Posta</Text>
                <TextInput
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  placeholder="muhammed@kaplan.com"
                  enableErrors={errors.email ? true : false}
                  validate={['email']}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  validationMessage={[
                    'Lütfen geçerli bir e-posta adresi giriniz',
                  ]}
                  validateOnBlur
                />
              </View>
              <View marginT-30>
                <Text text70BL>Parola</Text>
                <TextInput
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  placeholder="Parola"
                  secureTextEntry
                  autoCorrect={false}
                  autoCapitalize="none"
                  autoComplete="password"
                />
              </View>
              <Button
                onPress={handleSubmit}
                marginT-36
                enableShadow
                loading={isSubmitting}
                disabled={
                  errors.email || errors.password || isSubmitting || !isValid
                    ? true
                    : false
                }
              >
                <Text white>Giriş yap</Text>
              </Button>
            </View>
          )}
        </Formik>

        <Button link onPress={onPressRegister}>
          <Text center marginT-50 greyText>
            Bir hesabın yok mu ? <Text primary>Kayıt ol</Text>
          </Text>
        </Button>
      </View>
    </Page>
  )
}
