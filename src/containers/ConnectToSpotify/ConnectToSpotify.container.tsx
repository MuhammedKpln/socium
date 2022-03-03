import Button from '@/components/Button/Button.component'
import { Icon } from '@/components/Icon/Icon.component'
import { Page } from '@/components/Page/Page.component'
import { Toast } from '@/components/Toast/Toast.component'
import { connectToSpotify } from '@/services/spotify.service'
import { useAppSelector } from '@/store'
import { clear } from '@/store/reducers/spotify.reducer'
import { showToast, toastRef, ToastStatus } from '@/utils/toast'
import React, { useCallback, useState } from 'react'
import Text from 'react-native-ui-lib/text'
import View from 'react-native-ui-lib/view'
import { useDispatch } from 'react-redux'

export function ConnectToSpotifyContainer() {
  const [connecting, setConnecting] = useState<boolean>(false)
  const userInfo = useAppSelector(state => state.spotifyReducer.userInfo)
  const dispatch = useDispatch()

  const onPressConnect = useCallback(async () => {
    setConnecting(true)
    const connect = await connectToSpotify().finally(() => setConnecting(false))

    if (!connect) {
      showToast(
        ToastStatus.Error,
        'Bilinmeyen bir hata, devam ederse lütfen bizimle iletişime geçiniz.',
      )

      return
    }

    showToast(
      ToastStatus.Success,
      'Giriş başarılı! Artık profilinizde dinlediğiniz şarkı gözükebilir.',
    )
  }, [])

  const onPressDisconnect = useCallback(async () => {
    dispatch(clear())
    showToast(ToastStatus.Success, 'Çıkış başarılı')
  }, [dispatch])

  return (
    <Page
      style={{ backgroundColor: '#191414', justifyContent: 'space-around' }}
    >
      <View marginT-20 center spread>
        <Icon name="spotify" size={100} color="#1DB954" />
        <View marginT-20>
          <Text white header>
            {userInfo
              ? `Merhaba, ${userInfo.display_name}!`
              : 'Spotify ile giriş yapın'}
          </Text>
          {!userInfo && (
            <Text white font17>
              Dinlediğiniz şarkıları profilinizde gözüksün!
            </Text>
          )}
        </View>
      </View>

      <Button
        throttleTime={1000}
        onPress={userInfo ? onPressDisconnect : onPressConnect}
        loading={connecting}
        backgroundColor={userInfo ? '#191414' : '#1DB954'}
        label={userInfo ? 'Çıkış yap' : 'Spotify ile bağlan'}
        iconSource={() => (
          <Icon
            name="spotify"
            color="#FFF"
            size={20}
            style={{ marginRight: 10 }}
          />
        )}
      />

      <Toast ref={toastRef} />
    </Page>
  )
}
