import Button from '@/components/Button/Button.component'
import { Icon } from '@/components/Icon/Icon.component'
import { Page } from '@/components/Page/Page.component'
import { Post } from '@/components/Post/Post.component'
import { TextInput } from '@/components/TextInput/TextInput.component'
import { useAppSelector } from '@/store'
import { Formik } from 'formik'
import React, { useMemo } from 'react'
import { Colors } from 'react-native-ui-lib'
import Text from 'react-native-ui-lib/text'
import View from 'react-native-ui-lib/view'
import * as Yup from 'yup'

export function NewPostContainer() {
  const user = useAppSelector(state => state.userReducer.user)
  const initialValues = useMemo(() => ({ title: '', content: '' }), [])

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
  return (
    //   @ts-ignore
    <Page scrollable keyboardShouldPersistTaps="handled">
      <View>
        <Text fontGilroyBold font17>
          Önizleme
        </Text>
      </View>

      <Formik
        initialValues={initialValues}
        validationSchema={formValidationSchema}
        onSubmit={async values => null}
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
          <>
            <Post
              title={values.title}
              content={values.content}
              isLiked={false}
              likesCount={0}
              commentsCount={0}
              //@ts-ignore
              user={user}
              date={new Date()}
              onPressLike={() => null}
              onPressComment={() => null}
              onPressPost={() => null}
              onPressSave={() => null}
              onPressRemove={() => null}
            />
            <TextInput
              onChangeText={handleChange('content')}
              onBlur={handleBlur('content')}
              value={values.content}
              placeholder="Neler düşünüyorsun?"
              multiline
              style={{ height: 95 }}
              floatingPlaceholder
            />

            <View row marginT-10>
              <Icon
                name="picture"
                size={32}
                color={Colors.primary}
                style={{ marginRight: 30 }}
              />
              <Icon
                name="picture"
                size={32}
                color={Colors.primary}
                style={{ marginRight: 30 }}
              />
              <Icon
                name="picture"
                size={32}
                color={Colors.primary}
                style={{ marginRight: 30 }}
              />
            </View>

            <Button
              label="Paylaş"
              marginT-30
              onPress={handleSubmit}
              marginT-36
              enableShadow
              loading={isSubmitting}
              disabled={isSubmitting || !isValid ? true : false}
            />
          </>
        )}
      </Formik>
    </Page>
  )
}
