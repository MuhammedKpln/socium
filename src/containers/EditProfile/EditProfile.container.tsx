import { Avatar } from '@/components/Avatar/Avatar.component'
import Button from '@/components/Button/Button.component'
import { Page } from '@/components/Page/Page.component'
import { TextInput } from '@/components/TextInput/TextInput.component'
import { Toast } from '@/components/Toast/Toast.component'
import {
  EDIT_PROFILE,
  IEditProfileResponse,
  IEditProfileVariables,
} from '@/graphql/mutations/EditProfile.mutations'
import {
  FETCH_USER_PRFOFILE,
  IFetchUserProfileResponse,
  IFetchUserProfileVariables,
} from '@/graphql/queries/User.query'
import { Routes } from '@/navigators/navigator.props'
import { useAppSelector } from '@/store'
import { updateUser } from '@/store/reducers/user.reducer'
import { showToast, toastRef, ToastStatus } from '@/utils/toast'
import { useMutation } from '@apollo/client'
import { useNavigation } from '@react-navigation/native'
import { Formik } from 'formik'
import React, { useCallback, useMemo } from 'react'
import { Colors } from 'react-native-ui-lib'
import DateTimePicker from 'react-native-ui-lib/dateTimePicker'
import Switch from 'react-native-ui-lib/switch'
import Text from 'react-native-ui-lib/text'
import TouchableOpacity from 'react-native-ui-lib/touchableOpacity'
import View from 'react-native-ui-lib/view'
import { useDispatch } from 'react-redux'
import * as Yup from 'yup'

export function EditProfileContainer() {
  const user = useAppSelector(state => state.userReducer.user)
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const todayDate = useMemo(() => new Date(), [])
  const maximumDate = useMemo(() => {
    const date = new Date()
    date.setFullYear(todayDate.getFullYear() - 17, 11)

    return date
  }, [todayDate])
  const initialValues = useMemo(() => {
    return {
      username: user?.username,
      birthday: new Date(user?.birthday || ''),
      blockIncomingCalls: user?.blockIncomingCalls,
    }
  }, [user])
  const validationSchema = useMemo(() => {
    return Yup.object({
      username: Yup.string()
        .required('Kullanıcı adı boş olamaz')
        .min(3, 'En az 3 karakter olmalıdır')
        .max(20, 'En fazla 20 karakter olmalıdır'),
      birthday: Yup.date().required('Doğum tarihi boş olamaz'),
      blockIncomingCalls: Yup.boolean().required(
        'Lütfen kısa bir süre için telefonunuza gelen çağrılarınızı engelleyin',
      ),
    })
  }, [])

  const [editProfile] = useMutation<
    IEditProfileResponse,
    IEditProfileVariables
  >(EDIT_PROFILE)

  const onPressChangeAvatar = useCallback(() => {
    navigation.navigate(Routes.ChangeAvatar)
  }, [navigation])

  const _handleSubmit = useCallback(
    async (values: typeof initialValues) => {
      await editProfile({
        variables: {
          username: values.username,
          birthday: values.birthday,
          blockIncomingCalls: values.blockIncomingCalls,
        },
        update: (cache, { data }) => {
          const _user = cache.readQuery<
            IFetchUserProfileResponse,
            IFetchUserProfileVariables
          >({
            query: FETCH_USER_PRFOFILE,
            variables: {
              username: user?.username ?? '',
            },
          })

          cache.writeQuery({
            query: FETCH_USER_PRFOFILE,
            variables: {
              username: user?.username,
            },
            data: {
              getUser: { ...data?.editProfile, ..._user?.getUser },
              userPosts: _user?.userPosts,
            },
          })

          //@ts-ignore
          dispatch(updateUser(data?.editProfile))
        },
        onCompleted: () => {
          showToast(ToastStatus.Success, 'Profiliniz başarıyla güncellendi')
        },
        onError: () => {
          showToast(ToastStatus.Error, 'Profil güncellenirken bir hata oluştu!')
        },
      })
    },
    [editProfile, user, dispatch],
  )

  return (
    <Page>
      <TouchableOpacity onPress={onPressChangeAvatar} center>
        <>
          <Avatar
            userAvatar={user?.avatar ?? ''}
            size={80}
            containerStyle={{ borderColor: Colors.primary, borderWidth: 2 }}
          />
          <Text primary fontSfProMedium font16 marginT-5>
            Avatarını değiştir
          </Text>
        </>
      </TouchableOpacity>
      <View marginT-20>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          validateOnBlur
          onSubmit={_handleSubmit}
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
          }) => (
            <View>
              <View>
                <Text fontSfProRegular bold marginB-10>
                  Kullanıcı adı:
                </Text>
                <TextInput
                  onChangeText={handleChange('username')}
                  value={values.username}
                  onBlur={handleBlur('username')}
                  enableErrors={!isValid}
                  validationMessage={errors.username}
                  autoCapitalize="none"a
                />
              </View>

              <View marginT-30>
                <Text fontSfProRegular bold marginB-10>
                  Doğum tarihi:
                </Text>
                <DateTimePicker
                  value={values.birthday ?? new Date()}
                  mode="date"
                  is24Hour={true}
                  maximumDate={maximumDate}
                  onChange={_date => setFieldValue('birthday', _date)}
                  locale="tr"
                />
              </View>
              <View row marginT-30>
                <Switch
                  value={values.blockIncomingCalls}
                  onValueChange={value => {
                    setFieldValue('blockIncomingCalls', value)
                  }}
                />

                <Text textColor center marginL-10 marginT-2>
                  Gelen aramaları engelle
                </Text>
              </View>

              <View marginT-20>
                <Button
                  label="Kaydet"
                  loading={isSubmitting}
                  onPress={handleSubmit}
                />
              </View>
            </View>
          )}
        </Formik>
      </View>
      <Toast ref={toastRef} />
    </Page>
  )
}
