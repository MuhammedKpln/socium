import Button from '@/components/Button/Button.component'
import { Page } from '@/components/Page/Page.component'
import { TextInput } from '@/components/TextInput/TextInput.component'
import {
  IResendVerificationCodeResponse,
  IVerifyEmailResponse,
  IVerifyEmailVariables,
  RESEND_CONFIRM_MAIL,
  VERIFIY_EMAIL,
} from '@/graphql/mutations/EmailService.mutation'
import { Routes } from '@/navigators/navigator.props'
import { navigateAndSimpleReset } from '@/navigators/utils/navigation'
import { useAppSelector } from '@/store'
import { showToast, ToastStatus } from '@/utils/toast'
import { wait } from '@/utils/utils'
import { useMutation } from '@apollo/client'
import { Formik } from 'formik'
import AnimatedLottieView from 'lottie-react-native'
import React, { useCallback, useMemo, useState } from 'react'
import { Assets, Colors, Typography } from 'react-native-ui-lib'
import Text from 'react-native-ui-lib/text'
import View from 'react-native-ui-lib/view'
import * as Yup from 'yup'

export function VerifyEmail() {
  const [showImage, setShowImage] = useState<boolean>(false)
  const userEmail = useAppSelector(state => state.userReducer.user?.email)
  const formValidationSchema = useMemo(
    () =>
      Yup.object({
        verificationCode: Yup.number()
          .typeError('Lütfen geçerli bir doğrulama kodu giriniz')
          .required('Lütfen geçerli bir doğrulama kodu giriniz')
          .integer()
          .moreThan(
            6,
            'Lütfen en az 6 karakterden oluşan doğrulama kodunuzu girdiğinizden emin olun.',
          )
          .min(1),
      }),
    [],
  )
  const initialValues = useMemo(() => {
    return {
      verificationCode: '',
    }
  }, [])

  const [verifyEmail] = useMutation<
    IVerifyEmailResponse,
    IVerifyEmailVariables
  >(VERIFIY_EMAIL)

  const [resendConfirmMail] =
    useMutation<IResendVerificationCodeResponse>(RESEND_CONFIRM_MAIL)

  const onSubmit = useCallback(
    async ({ verificationCode }) => {
      if (!userEmail) return

      await verifyEmail({
        variables: {
          email: userEmail,
          verificationCode: Number(verificationCode),
        },
        onCompleted: data => {
          if (data.confirmEmail) {
            showToast(
              ToastStatus.Success,
              'Teşekkürler, e-posta adresiniz onaylanmıştır.',
            )

            navigateAndSimpleReset(Routes.App)
          } else {
            showToast(ToastStatus.Error, 'Lütfen daha sonra tekrar deneyiniz.')
          }
        },
        onError: () => {
          showToast(ToastStatus.Error, 'Lütfen daha sonra tekrar deneyiniz.')
        },
      })
    },
    [verifyEmail, userEmail],
  )

  const onPressResend = useCallback(async () => {
    await resendConfirmMail({
      onCompleted: async data => {
        if (data.resendConfirmMail) {
          showToast(
            ToastStatus.Success,
            'Teşekkürler, e-posta adresinize bilgiler yollanmıştır.',
          )
        } else {
          showToast(ToastStatus.Error, 'Lütfen daha sonra tekrar deneyiniz.')
        }
      },
      onError: () => {
        showToast(ToastStatus.Error, 'Lütfen daha sonra tekrar deneyiniz.')
      },
    })
  }, [resendConfirmMail])

  return (
    <Page>
      <View height={200} center>
        {!showImage ? (
          <AnimatedLottieView
            source={Assets.animations.mailSent}
            autoPlay
            loop={false}
            style={{ height: 200 }}
            onAnimationFinish={() => {
              wait(1000).then(() => setShowImage(true))
            }}
            duration={5000}
          />
        ) : (
          <>{Assets.app.VerifyMail}</>
        )}
      </View>

      <View>
        <Text font17 bold textColor marginB-10>
          E-posta doğrulama kodunuz gönderildi!
        </Text>
        <Text font13 textColor>
          Lütfen e-posta adresinize gelen doğrulama kodunu giriniz.
        </Text>

        <Formik
          initialValues={initialValues}
          validationSchema={formValidationSchema}
          onSubmit={onSubmit}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            isValid,
            isSubmitting,
          }) => {
            return (
              <>
                <TextInput
                  marginT-20
                  placeholder="Doğrulama kodunuz"
                  multiline={false}
                  keyboardType={'numeric'}
                  onChangeText={handleChange('verificationCode')}
                  onBlur={handleBlur('verificationCode')}
                  maxLength={6}
                  value={values.verificationCode}
                  enableErrors={errors.verificationCode ? true : false}
                  validationMessage={errors.verificationCode}
                />

                <View spread height={100} marginT-30 row>
                  <Button
                    onPress={handleSubmit}
                    label="Doğrula"
                    style={{ width: '45%', height: 40 }}
                    avoidInnerPadding
                    avoidMinWidth
                    labelStyle={{ ...Typography.font13 }}
                    disabled={!isValid}
                    loading={isSubmitting}
                  />

                  <Button
                    outline
                    outlineColor={Colors.primary}
                    onPress={onPressResend}
                    label="Yeniden gönder"
                    style={{ width: '45%', height: 40 }}
                    avoidInnerPadding
                    labelStyle={{ ...Typography.font13 }}
                  />
                </View>
              </>
            )
          }}
        </Formik>
      </View>
    </Page>
  )
}
