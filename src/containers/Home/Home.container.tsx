import { Icon } from '@/components/Icon/Icon.component'
import { Page } from '@/components/Page/Page.component'
import { Surface } from '@/components/Surface/Surface.component'
import { useFeatureHighlight } from '@/hooks/useFeatureHighlight'
import { useZodiac } from '@/hooks/useZodiac'
import { useAppSelector } from '@/store'
import { incremented } from '@/store/reducers/counter.reducer'
import { FeatureHighlights } from '@/store/reducers/featureHighlight.reducer'
import { updateTheme } from '@/store/reducers/theme.reducer'
import { showToast, ToastStatus } from '@/utils/toast'
import React, { useMemo, useState } from 'react'
import { useEffect } from 'react'
import { Text } from 'react-native'
import { Button } from 'react-native-ui-lib'
import FeatureHighlight from 'react-native-ui-lib/featureHighlight'
import { useDispatch } from 'react-redux'

const HomeContainer = () => {
  const value = useAppSelector(state => state.counterSlice.value)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const { image } = useZodiac('2000-01-05')

  useEffect(() => {
    setTimeout(() => setLoading(true), 3000)
  }, [])

  const featureHighlightTitles = useMemo(
    () => [
      'Konuşmak mı istiyorsun?',
      'Kullanıcıyı takip edin!',
      'İçinizi dökün!',
    ],
    [],
  )
  const featureHighlightMessages = useMemo(
    () => [
      'Kullanıcıya dertleşme isteği gönderin!',
      'Kullanıcıyı takip ederek, kullanıcının en son ki yazılarını ana sayfada görebilirsiniz.',
      'Konuşmak için kafa dengi birisine mi ihtiyacınız var? İçinizi dökün!',
    ],
    [],
  )

  const { addTarget, featureHighlightProps } = useFeatureHighlight(
    FeatureHighlights.DiscoverPosts,
    featureHighlightTitles,
    featureHighlightMessages,
  )

  return (
    <Page scrollable>
      <SkeletonView
        showContent={loading}
        template={SkeletonView.templates.TEXT_CONTENT}
        renderContent={() => (
          <Surface padding-20 margin-10 ref={r => addTarget(r, 0)}>
            <Icon name="Untitled" size={30} />
            <Icon name={image} size={30} />
            <Button onPress={() => dispatch(incremented())}>
              <Text>selaem {value}</Text>
            </Button>
          </Surface>
        )}
      />

      <Button
        onPress={() => showToast(ToastStatus.Success, 'selam')}
        testID="w"
      >
        <Text>selam</Text>
      </Button>
      <Button
        ref={ref => addTarget(ref, 1)}
        testID="we"
        style={{ opacity: 1 }}
        onPress={() =>
          dispatch(
            updateTheme({
              theme: 'dark',
            }),
          )
        }
      >
        <Text>dark mode</Text>
      </Button>
      <Button
        ref={ref => addTarget(ref, 2)}
        onPress={() =>
          dispatch(
            updateTheme({
              theme: 'light',
            }),
          )
        }
      >
        <Text>light mode</Text>
      </Button>
      <FeatureHighlight {...featureHighlightProps()} />
    </Page>
  )
}

export default HomeContainer
