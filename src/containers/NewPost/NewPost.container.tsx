import Button from '@/components/Button/Button.component'
import { Dialog } from '@/components/Dialog/Dialog.component'
import { Icon } from '@/components/Icon/Icon.component'
import { InstagramPost } from '@/components/InstagramPost/InstagramPost.component'
import { Page } from '@/components/Page/Page.component'
import { Post } from '@/components/Post/Post.component'
import { TextInput } from '@/components/TextInput/TextInput.component'
import { TwitterPost } from '@/components/TwitterPost/TwitterPost.component'
import {
  CREATE_POST,
  ICreatePostResponse,
  ICreatePostVariables,
} from '@/graphql/mutations/CreatePost.mutation'
import {
  IListCategoriesResponse,
  LIST_ALL_CATEGORIES,
} from '@/graphql/queries/Categories.query'
import { Routes } from '@/navigators/navigator.props'
import { navigate, navigateBack } from '@/navigators/utils/navigation'
import { useAppSelector } from '@/store'
import { PostType } from '@/types/post.types'
import { IInstagramMeta, IYoutubeMeta } from '@/types/socialMedia.types'
import { showToast, ToastStatus } from '@/utils/toast'
import { useMutation, useQuery } from '@apollo/client'
import { Formik } from 'formik'
import { map } from 'lodash'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ScrollView } from 'react-native'
import { Colors } from 'react-native-ui-lib'
import Picker from 'react-native-ui-lib/picker'
import Text from 'react-native-ui-lib/text'
import View from 'react-native-ui-lib/view'
import { getYoutubeMeta } from 'react-native-youtube-iframe'
import * as Yup from 'yup'

export function NewPostContainer() {
  const user = useAppSelector(state => state.userReducer.user)
  const initialValues = useMemo(() => ({ content: '', categoryId: null }), [])
  const [postType, setPostType] = useState<PostType>(PostType.Content)
  const [instagramData, setInstagramData] = useState<IInstagramMeta>()
  const [youtubeData, setYoutubeData] = useState<IYoutubeMeta>()
  const [additionalData, setAdditionalData] = useState<string>('')
  const [showAdditionalDataDialog, setShowAdditionalDataDialog] =
    useState<boolean>(false)
  const [newPost] = useMutation<ICreatePostResponse, ICreatePostVariables>(
    CREATE_POST,
  )
  const categories = useQuery<IListCategoriesResponse>(LIST_ALL_CATEGORIES)

  const formValidationSchema = useMemo(
    () =>
      Yup.object({
        content: Yup.string().required('Burası zorunlu bir alandır'),
        categoryId: Yup.number().required('Burası zorunlu bir alandır'),
      }),
    [],
  )
  const youtubeRegex = useMemo(
    () => new RegExp('(?:(?:http|https)://)?(?:www.)?(?:youtu.be|youtube.com)'),
    [],
  )
  const instagramRegex = useMemo(
    () =>
      new RegExp('(?:(?:http|https)://)?(?:www.)?(?:instagram.com|instagr.am)'),
    [],
  )
  const twitterRegex = useMemo(
    () => new RegExp('(?:(?:http|https)://)?(?:www.)?(?:twitter.com)'),
    [],
  )

  const fetchInstagramData = useCallback(async () => {
    const _instagramData = await fetch(
      `https://api.instagram.com/oembed/?url=${additionalData}`,
    )
    const json: IInstagramMeta = await _instagramData.json()

    setPostType(PostType.Instagram)
    setInstagramData(json)
  }, [additionalData])

  const fetchYoutubeMeta = useCallback(async () => {
    let videoId: string = ''

    if (additionalData.includes('youtu.be')) {
      videoId = additionalData.split('https://youtu.be/')[1]
    }
    if (additionalData.includes('watch?v=')) {
      videoId = additionalData.split('watch?v=')[1]
    }

    const meta = await getYoutubeMeta(videoId)

    setYoutubeData(meta)
  }, [additionalData])

  const renderYoutubeIframe = useCallback(() => {
    const YoutubePlayer =
      require('@/components/YoutubePlayer/YoutubePlayer.component').YTPlayer
    let videoId: string = ''

    if (additionalData.includes('youtu.be')) {
      videoId = additionalData.split('https://youtu.be/')[1]
    }
    if (additionalData.includes('watch?v=')) {
      videoId = additionalData.split('watch?v=')[1]
    }

    return <YoutubePlayer videoId={videoId} />
  }, [additionalData])

  useEffect(() => {
    if (additionalData.toLowerCase().match(instagramRegex)) {
      fetchInstagramData()
      return
    }

    if (additionalData.toLowerCase().match(youtubeRegex)) {
      fetchYoutubeMeta()
      setPostType(PostType.Youtube)
      return
    }

    if (additionalData.toLowerCase().match(twitterRegex)) {
      setPostType(PostType.Twitter)
      return
    }

    setPostType(PostType.Content)
  }, [
    additionalData,
    fetchInstagramData,
    instagramRegex,
    youtubeRegex,
    fetchYoutubeMeta,
    twitterRegex,
  ])

  useEffect(() => {
    if (!showAdditionalDataDialog) {
      setInstagramData(undefined)
      setYoutubeData(undefined)
    }
  }, [showAdditionalDataDialog])

  const renderAdditionalData = useCallback(() => {
    return (
      <Dialog
        visible={showAdditionalDataDialog}
        onDismiss={() => setShowAdditionalDataDialog(false)}
        title="Ek Bilgiler"
        bottom
        actions={
          <Button
            label="Kaydet"
            onPress={() => setShowAdditionalDataDialog(false)}
          />
        }
      >
        <ScrollView>
          {postType === PostType.Instagram && instagramData && (
            <InstagramPost
              authorName={instagramData.author_name}
              thumbnailUrl={instagramData.thumbnail_url}
              title={instagramData.title}
            />
          )}
          {postType === PostType.Youtube && youtubeData && (
            <View center>
              {renderYoutubeIframe()}
              <Text greyText marginV-10 bold font13>
                {youtubeData.title}
              </Text>
            </View>
          )}
          {postType === PostType.Twitter && (
            <View center>
              <Text greyText marginV-10 bold font13>
                <TwitterPost twitterUrl={additionalData} />
                {/* <InstagramPost authorName={twitterData.author_name} thumbnailUrl={twitterData.} /> */}
              </Text>
            </View>
          )}
        </ScrollView>

        <TextInput
          placeholder="Instagram, twitter, youtube.."
          onChangeText={e => setAdditionalData(e)}
        />
      </Dialog>
    )
  }, [
    showAdditionalDataDialog,
    additionalData,
    instagramData,
    postType,
    youtubeData,
    renderYoutubeIframe,
  ])

  const publishContent = useCallback(
    (values: typeof initialValues) => {
      newPost({
        variables: {
          content: values.content,
          additional: additionalData,
          type: postType,
          categoryId: values.categoryId !== null ? values.categoryId : 0,
        },
        onCompleted: post => {
          showToast(ToastStatus.Success, 'Başarıyla yayınlandı')
          navigateBack()
          navigate(Routes.PostDetails, {
            postId: post.createPost.id,
          })
        },
      })
    },
    [newPost, additionalData, postType],
  )

  return (
    <>
      {renderAdditionalData()}
      {/* @ts-ignore */}
      <Page scrollable keyboardShouldPersistTaps="handled">
        <View>
          <Text fontGilroyBold font17>
            Önizleme
          </Text>
        </View>

        <Formik
          initialValues={initialValues}
          validationSchema={formValidationSchema}
          onSubmit={async values => publishContent(values)}
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
            <>
              <Post
                content={
                  values.content.length < 1 ? 'Merhaba dünya!' : values.content
                }
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
                additional={additionalData}
                postType={postType}
              />
              <TextInput
                onChangeText={handleChange('content')}
                onBlur={handleBlur('content')}
                value={values.content}
                placeholder="Neler düşünüyorsun?"
                multiline
                style={{ height: 95 }}
                floatingPlaceholder
                enableErrors={errors.content ? true : false}
                validationMessage={errors.content}
              />

              <View row marginT-10>
                <Icon
                  name="link"
                  size={25}
                  color={Colors.primary}
                  style={{ marginRight: 30 }}
                  onPress={() => setShowAdditionalDataDialog(true)}
                />
                {/* <Icon
                  name="picture"
                  size={25}
                  color={Colors.primary}
                  style={{ marginRight: 30 }}
                  onPress={() => setShowAdditionalDataDialog(true)}
                />
                <Icon
                  name="gif"
                  size={25}
                  color={Colors.primary}
                  style={{ marginRight: 30 }}
                  onPress={() => setShowAdditionalDataDialog(true)}
                /> */}
              </View>
              <View marginV-20>
                <Picker
                  showSearch
                  migrateTextField
                  searchPlaceholder="Kategori ara"
                  placeholder="Ya da başka bir kategori seçin."
                  value={values.categoryId}
                  onChange={(val: { label: string; value: number }) =>
                    setFieldValue('categoryId', val.value)
                  }
                >
                  {map(categories.data?.categories, c => {
                    return (
                      <Picker.Item key={c.id} value={c.id} label={c.name} />
                    )
                  })}
                </Picker>

                {errors.categoryId ? (
                  <Text red10> Lütfen bir kategori seçiniz. </Text>
                ) : null}
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
    </>
  )
}
