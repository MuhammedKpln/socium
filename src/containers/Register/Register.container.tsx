import Button from '@/components/Button/Button.component'
import { Page } from '@/components/Page/Page.component'
import { TextInput } from '@/components/TextInput/TextInput.component'
import { IRegisterVariables, REGISTER } from '@/graphql/mutations/Auth.mutation'
import { Routes } from '@/navigators/navigator.props'
import { navigate } from '@/navigators/utils/navigation'
import { EncryptedStorageKeys, useStorage } from '@/storage'
import { updateLoginStatus } from '@/store/reducers/user.reducer'
import { ERROR_CODES, ERROR_CODES_RAW } from '@/types/error_codes'
import type { IRegisterResponse } from '@/types/register.types'
import { handleApolloErrors } from '@/utils/apollo'
import { showToast, ToastStatus } from '@/utils/toast'
import { useMutation } from '@apollo/client'
import { Formik, FormikProps } from 'formik'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Wizard } from 'react-native-ui-lib'
import Checkbox from 'react-native-ui-lib/checkbox'
import Text from 'react-native-ui-lib/text'
import View from 'react-native-ui-lib/view'
import { useDispatch } from 'react-redux'
import * as Yup from 'yup'

export function RegisterContainer() {
  const [wizardStep, setWizardStep] = useState<number>(0)
  const formRef = useRef<FormikProps<typeof initialValues>>()
  const [, saveAccessToken] = useStorage(EncryptedStorageKeys.AccessToken)
  const [, saveRefreshToken] = useStorage(EncryptedStorageKeys.RefreshToken)
  const [, saveAccessTokenExpireDate] = useStorage(
    EncryptedStorageKeys.AccessTokenExpireDate,
  )
  const [register] = useMutation<IRegisterResponse, IRegisterVariables>(
    REGISTER,
  )
  const dispatch = useDispatch()
  const initialValues = useMemo(
    () => ({
      email: '',
      username: '',
      password: '',
      passwordConfirmation: '',
      privacyAccepted: false,
    }),
    [],
  )

  const formValidationSchema = useMemo(
    () =>
      Yup.object({
        email: Yup.string()
          .email('Lütfen geçerli bir e-posta adresi giriniz')
          .required('Lütfen geçerli bir e-posta adresi giriniz'),
        username: Yup.string().required(
          'Lütfen geçerli bir kullanıcı adı giriniz',
        ),
        password: Yup.string().required('Lütfen geçerli bir şifre giriniz'),
        passwordConfirmation: Yup.string()
          .required('Bu alan zorunludur.')
          .equals([Yup.ref('password')], 'Lütfen şifrenizi doğrulayın.'),
        privacyAccepted: Yup.boolean()
          .required('Bu alan zorunludur.')
          .isTrue('Lütfen kullanıcı sözleşmesini kabul ediniz.'),
      }),
    [],
  )

  const onPressRegister = useCallback(
    async (values: IRegisterVariables) => {
      return await register({
        variables: values,

        onError: e => {
          const errorCode = handleApolloErrors(
            e,
            ERROR_CODES_RAW.USER_IS_ALREADY_REGISTERED,
          )

          if (errorCode) {
            showToast(ToastStatus.Error, ERROR_CODES[errorCode])
          } else {
            showToast(ToastStatus.Error, 'Lütfen daha sonra tekrar deneyiniz.')
          }
        },
        onCompleted: async data => {
          showToast(
            ToastStatus.Success,
            `Başarılı bir şekilde kayıt oldunuz! Lütfen e-posta adresinizi doğrulayın.`,
          )
          dispatch(
            updateLoginStatus({
              isLoggedIn: true,
              user: data.register.user,
            }),
          )

          saveAccessToken(data.register.access_token)
          saveRefreshToken(data.register.refresh_token)
          saveAccessTokenExpireDate(data.register.expire_date)

          setWizardStep(1)
        },
      })
    },
    [
      register,
      dispatch,
      saveAccessToken,
      saveRefreshToken,
      saveAccessTokenExpireDate,
    ],
  )

  function onPressLogin() {
    navigate(Routes.Login, {})
  }

  const registerForm = useCallback(() => {
    return (
      <>
        <Formik
          initialValues={initialValues}
          //@ts-ignore
          innerRef={formRef}
          validationSchema={formValidationSchema}
          onSubmit={async values => await onPressRegister(values)}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            isValid,
            isSubmitting,
            setFieldValue,
          }) => {
            return (
              <View>
                <View marginT-30>
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
                  />
                </View>
                <View marginT-30>
                  <Text text70BL>Kullanıcı adı</Text>
                  <TextInput
                    onChangeText={handleChange('username')}
                    onBlur={handleBlur('username')}
                    value={values.username}
                    placeholder="muhammedkpln"
                    enableErrors={errors.username ? true : false}
                    autoCapitalize="none"
                    autoCorrect={false}
                    validationMessage={errors.username}
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
                    enableErrors={errors.password ? true : false}
                    validationMessage={errors.password}
                  />
                </View>
                <View marginT-30>
                  <Text text70BL>Parola (Yeniden)</Text>
                  <TextInput
                    onChangeText={handleChange('passwordConfirmation')}
                    onBlur={handleBlur('passwordConfirmation')}
                    value={values.passwordConfirmation}
                    placeholder="Parola"
                    secureTextEntry
                    autoCorrect={false}
                    autoCapitalize="none"
                    autoComplete="password"
                    validationMessage={errors.passwordConfirmation}
                    enableErrors={errors.passwordConfirmation ? true : false}
                  />
                </View>
                <View row marginT-30>
                  <Checkbox
                    value={values.privacyAccepted}
                    onValueChange={e => setFieldValue('privacyAccepted', e)}
                    onBlur={handleBlur('privacyAccepted')}
                  />
                  <Text marginL-15>
                    <Text primary underline>
                      Üyelik Sözleşmesi
                    </Text>
                    ,{' '}
                    <Text primary underline>
                      Kişisel Verilerin Korunması
                    </Text>{' '}
                    ve{' '}
                    <Text primary underline>
                      Gizlilik Politikası
                    </Text>
                    ’nı okudum, kabul ediyorum.
                  </Text>
                </View>

                <Button
                  onPress={handleSubmit}
                  marginT-36
                  enableShadow
                  loading={isSubmitting}
                  disabled={isSubmitting || !isValid ? true : false}
                >
                  <Text white>Kayıt ol</Text>
                </Button>
              </View>
            )
          }}
        </Formik>
      </>
    )
  }, [formValidationSchema, initialValues, onPressRegister])

  const renderSteps = useCallback(() => {
    switch (wizardStep) {
      case 0:
        return registerForm()

      case 1:
        const VerifyEmail =
          require('./components/VerifyEmail.component').VerifyEmail
        return <VerifyEmail />
    }
  }, [wizardStep, registerForm])

  return (
    <Page>
      <KeyboardAwareScrollView>
        <Wizard
          activeIndex={wizardStep}
          onActiveIndexChanged={index => setWizardStep(index)}
        >
          <Wizard.Step
            state={
              !formRef.current?.isValid
                ? Wizard.States.ENABLED
                : Wizard.States.COMPLETED
            }
            label="Kayıt ol"
          />
          <Wizard.Step
            state={
              formRef.current?.isValid
                ? Wizard.States.ENABLED
                : Wizard.States.DISABLED
            }
            label="E-posta adresini doğrula"
            enabled={formRef.current?.isValid}
          />
        </Wizard>

        {renderSteps()}

        <Button link onPress={onPressLogin}>
          <Text center marginT-50 greyText>
            Bir hesabın var mı? <Text primary>Giriş Yap</Text>
          </Text>
        </Button>
      </KeyboardAwareScrollView>
    </Page>
  )
}
