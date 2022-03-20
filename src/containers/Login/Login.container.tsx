import Logo from '@/assets/icons/Logo'
import Button from '@/components/Button/Button.component'
import { Icon } from '@/components/Icon/Icon.component'
import { Page } from '@/components/Page/Page.component'
import { TextInput } from '@/components/TextInput/TextInput.component'
import {
  ILoginResponse,
  ILoginVariables,
  ILoginWithGoggleVariables,
  ILoginWithGoogleResponse,
  LOGIN,
  LOGIN_GOOGLE,
} from '@/graphql/mutations/Auth.mutation'
import { Routes } from '@/navigators/navigator.props'
import { navigate, navigateAndSimpleReset } from '@/navigators/utils/navigation'
import { EncryptedStorageKeys, useStorage } from '@/storage'
import { updateLoginStatus } from '@/store/reducers/user.reducer'
import { ERROR_CODES, ERROR_CODES_RAW } from '@/types/error_codes'
import { handleApolloErrors } from '@/utils/apollo'
import { showToast, ToastStatus } from '@/utils/toast'
import { useLazyQuery, useMutation } from '@apollo/client'
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin'
import type { User } from '@react-native-google-signin/google-signin'
import { Formik } from 'formik'
import { useCallback, useState } from 'react'
import React, { useMemo } from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'
import type { TextInput as RNTextInput } from 'react-native'
import Text from 'react-native-ui-lib/text'
import View from 'react-native-ui-lib/view'
import { useDispatch } from 'react-redux'
import * as Yup from 'yup'
import {
  CHECK_IF_USER_IS_REGISTERED,
  ICheckIfUserIsRegisteredResponse,
  ICheckIfUserIsRegisteredVariables,
} from '@/graphql/queries/Auth.query'
import { Colors } from 'react-native-ui-lib'
import { AppleButton } from '@invertase/react-native-apple-authentication'
import { GoogleSignIn } from './components/GoogleSignIn.component'
import { LoaderScreen } from '@/components/LoaderScreen/LoaderScreen.component'
import { EnabledFeatures } from '@/config'

export function LoginContainer() {
  const [login] = useMutation<ILoginResponse, ILoginVariables>(LOGIN)
  const [loginWithGoogle, loginWithGoogleMeta] = useMutation<
    ILoginWithGoogleResponse,
    ILoginWithGoggleVariables
  >(LOGIN_GOOGLE)
  const dispatch = useDispatch()
  const [showGoogleRegisterDialog, setShowGoogleRegisterDialog] =
    useState<boolean>(false)
  const [googleOauth, setGoogleOauth] = useState<User | null>(null)
  const [, saveAccessToken] = useStorage(EncryptedStorageKeys.AccessToken)
  const [, saveRefreshToken] = useStorage(EncryptedStorageKeys.RefreshToken)
  const [, saveAccessTokenExpireDate] = useStorage(
    EncryptedStorageKeys.AccessTokenExpireDate,
  )
  const passwordRef = useRef<RNTextInput>(null)
  const initialValues = useMemo(() => ({ email: '', password: '' }), [])
  const formValidationSchema = useMemo(
    () =>
      Yup.object({
        email: Yup.string()
          .email('Lütfen geçerli bir e-posta adresi giriniz')
          .required('Burası zorunlu bir alandır'),
        password: Yup.string().required('Burası zorunlu bir alandır'),
      }),
    [],
  )
  const [checkIfUserIsRegistered, checkIfUserIsRegisteredMeta] = useLazyQuery<
    ICheckIfUserIsRegisteredResponse,
    ICheckIfUserIsRegisteredVariables
  >(CHECK_IF_USER_IS_REGISTERED, {
    onCompleted: data => {
      console.log(data)

      if (!data.checkIfUserIsRegistered) {
        setShowGoogleRegisterDialog(true)
      }
    },
  })

  useEffect(() => {
    GoogleSignin.configure({
      scopes: [
        'https://www.rpis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        '1001258849296-qj3oj2fq8irkr8vtmrn57j8cpal1u73d.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      hostedDomain: '', // specifies a hosted domain restriction
      forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      accountName: '', // [Android] specifies an account name on the device that should be used
      googleServicePlistPath: '', // [iOS] optional, if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
    })
  }, [])

  useEffect(() => {
    console.log(
      checkIfUserIsRegisteredMeta.data?.checkIfUserIsRegistered,
      googleOauth,
    )
    if (
      checkIfUserIsRegisteredMeta.data?.checkIfUserIsRegistered &&
      googleOauth
    ) {
      loginWithGoogle({
        variables: {
          email: googleOauth.user.email,
          idToken: googleOauth.idToken ?? '',
        },
        onCompleted: data => {
          dispatch(
            updateLoginStatus({
              isLoggedIn: true,
              user: data.loginGoogle.user,
            }),
          )

          saveAccessToken(data.loginGoogle.access_token)
          saveRefreshToken(data.loginGoogle.refresh_token)
          saveAccessTokenExpireDate(data.loginGoogle.expire_date)

          if (!data.loginGoogle.user.isEmailConfirmed) {
            showToast(
              ToastStatus.Error,
              'Lütfen e-posta adresinizi doğrulayın.',
            )

            navigateAndSimpleReset(Routes.EmailVerification)
          } else {
            showToast(
              ToastStatus.Success,
              `Hoşgeldin ${data.loginGoogle.user.username}!`,
            )

            navigate(Routes.App, {})
          }
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkIfUserIsRegisteredMeta, googleOauth])

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
        dispatch(
          updateLoginStatus({
            isLoggedIn: true,
            user: data.login.user,
          }),
        )

        saveAccessToken(data.login.access_token)
        saveRefreshToken(data.login.refresh_token)
        saveAccessTokenExpireDate(data.login.expire_date)

        if (!data.login.user.isEmailConfirmed) {
          showToast(ToastStatus.Error, 'Lütfen e-posta adresinizi doğrulayın.')

          navigateAndSimpleReset(Routes.EmailVerification)
        } else {
          showToast(
            ToastStatus.Success,
            `Hoşgeldin ${data.login.user.username}!`,
          )

          navigate(Routes.App, {})
        }
      },
    })
  }

  function onPressRegister() {
    navigate(Routes.Register, {})
  }

  const onPressGoogle = useCallback(async () => {
    try {
      await GoogleSignin.hasPlayServices()
      const userInfo = await GoogleSignin.signIn()

      console.log('User Info --> ', userInfo)

      await checkIfUserIsRegistered({
        variables: {
          email: userInfo.user.email,
        },
      }).catch(err => console.error('SA ', err))
      console.log(userInfo)
      if (userInfo) {
        setGoogleOauth(userInfo)
      } else {
        throw new Error()
      }
    } catch (error) {
      //@ts-ignore
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('canceld')
        //@ts-ignore
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('progress')
        //@ts-ignore
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('play')
        //@ts-ignore
      } else if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        console.log('play')
      } else {
        console.log(error)
      }
    }
  }, [checkIfUserIsRegistered])

  return (
    <>
      {loginWithGoogleMeta.loading && <LoaderScreen />}

      <Page flex center scrollable>
        {/* {googleSignedIn && ( */}
        <GoogleSignIn
          visible={showGoogleRegisterDialog}
          googleOAuth={googleOauth}
          onSuccess={() => {
            setShowGoogleRegisterDialog(false)
          }}
        />

        <Logo
          width={147}
          height={40}
          style={{ alignSelf: 'center', margin: 50 }}
        />
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
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  validationMessage={errors.email}
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  returnKeyType="next"
                />
              </View>
              <View marginT-30>
                <Text text70BL>Parola</Text>
                <TextInput
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  placeholder="Parola"
                  enableErrors={errors.password ? true : false}
                  secureTextEntry
                  autoCorrect={false}
                  autoCapitalize="none"
                  autoComplete="password"
                  validationMessage={errors.password}
                  ref={passwordRef}
                  onSubmitEditing={handleSubmit}
                />
              </View>
              <Button
                onPress={handleSubmit}
                marginT-36
                enableShadow
                loading={isSubmitting}
                disabled={isSubmitting || !isValid ? true : false}
              >
                <Text white>Giriş yap</Text>
              </Button>
            </View>
          )}
        </Formik>

        <Text greyText marginV-20 center>
          Yada, bunlarla giriş yapın...
        </Text>

        <View>
          <Button
            iconSource={() => (
              <Icon
                name="google"
                size={24}
                color={Colors.white}
                style={{ paddingRight: 10 }}
              />
            )}
            padding-10
            backgroundColor="#4285F4"
            onPress={onPressGoogle}
            label="Google ile giriş yap"
            marginB-20
          />

          {EnabledFeatures.appleLogin && (
            <AppleButton
              buttonStyle={AppleButton.Style.BLACK}
              buttonType={AppleButton.Type.SIGN_IN}
              cornerRadius={100}
              style={{
                width: '100%', // You must specify a width
                height: 45, // You must specify a height
              }}
              onPress={() => null}
            />
          )}
        </View>

        <Button link onPress={onPressRegister}>
          <Text center marginT-50 greyText>
            Bir hesabın yok mu ? <Text primary>Kayıt ol</Text>
          </Text>
        </Button>
      </Page>
    </>
  )
}
