import { client } from '@/App'
import { Config } from '@/config'
import { REMOVE_CURRENT_TRACK } from '@/graphql/mutations/RemoveCurrentTrack.mutation'
import { UPDATE_CURRENT_TRACK } from '@/graphql/mutations/UpdateCurrentTrack.mutation'
import { GET_USER_CURRENT_TRACK } from '@/graphql/queries/GetUserCurrentTrack.query'
import { store } from '@/store'
import {
  updateAccessToken,
  updateCurrentTrack,
  updateUserInfo,
} from '@/store/reducers/spotify.reducer'
import type {
  ISpotifyCurrentTrack,
  ISpotifyUserResponse,
} from '@/types/spotify'
import { showToast, ToastStatus } from '@/utils/toast'
import { InteractionManager } from 'react-native'
import { authorize } from 'react-native-app-auth'

const config = {
  clientId: Config.SPOTIFY_CLIENT_ID,
  redirectUrl: 'com.socium://post/selam',
  scopes: [
    'user-read-currently-playing',
    'user-read-private',
    'user-read-email',
  ],
  serviceConfiguration: {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
  },
}

const configureHeaders = (accessToken: string): Headers => {
  const headers = new Headers()
  headers.append('Authorization', 'Bearer ' + accessToken)

  return headers
}

const fetchUserInfo = async (
  accessToken: string,
): Promise<ISpotifyUserResponse> => {
  const authHeaders = configureHeaders(accessToken)

  const _userInfo = await fetch('https://api.spotify.com/v1/me', {
    headers: authHeaders,
  })
  const userInfo = await _userInfo.json()

  return userInfo
}

export const connectToSpotify = async (): Promise<boolean> => {
  const auth = await authorize(config).catch(err => {
    console.log(err)
    showToast(
      ToastStatus.Error,
      'Bilinmeyen bir hata, devam ederse lütfen bizimle iletişime geçiniz.',
    )
  })

  if (!auth) {
    return false
  }

  const accessToken = auth.accessToken
  const userInfo = await fetchUserInfo(accessToken)

  store.dispatch(updateAccessToken(accessToken))
  store.dispatch(updateUserInfo(userInfo))

  return true
}

export const getCurrentTrack =
  async (): Promise<ISpotifyCurrentTrack | null> => {
    const authToken = store.getState().spotifyReducer.accessToken

    if (!authToken) return null
    const authHeaders = configureHeaders(authToken)
    const _data = await fetch(
      'https://api.spotify.com/v1/me/player/currently-playing',
      {
        headers: authHeaders,
      },
    )

    if (_data.status !== 200) {
      //FIXME: handle error
      // await client.mutate({
      //   mutation: REMOVE_CURRENT_TRACK,
      // })

      return null
    }

    const data = await _data.json()
    if (data) {
      return data
    }

    return null
  }

export const updateCurrentTrackInterval = async () => {
  InteractionManager.runAfterInteractions(() => {
    setInterval(async () => {
      const currentTrack = await getCurrentTrack()
      const userId = store.getState().userReducer.user?.id
      const currentDatabaseTrack = await client.query({
        query: GET_USER_CURRENT_TRACK,
        variables: {
          userId,
        },
        fetchPolicy: 'network-only',
      })

      if (currentTrack) {
        const songName = currentTrack.item.name
        const artistName = currentTrack.item.artists[0].name
        const imageUrl = currentTrack.item.album.images[0].url
        const savedSongName =
          currentDatabaseTrack.data?.getUserCurrentTrack?.songName

        if (songName === savedSongName) {
          return
        }

        store.dispatch(updateCurrentTrack({ songName, artistName, imageUrl }))

        await client.mutate({
          mutation: UPDATE_CURRENT_TRACK,
          variables: { songName, artistName, imageUrl },
        })
      }
    }, 10000)
  })
}
