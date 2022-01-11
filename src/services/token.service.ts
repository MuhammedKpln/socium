import { client } from '@/App'
import { REFRESH_TOKEN } from '@/graphql/mutations/RefreshToken.mutation'
import { EncryptedStorageKeys, storage } from '@/storage'
import { store } from '@/store'

export const getNewToken = async () => {
  const _refreshToken = await storage.getStringAsync(
    EncryptedStorageKeys.RefreshToken,
  )
  const userId = store.getState().userReducer?.user?.id
  const response = await client.mutate({
    mutation: REFRESH_TOKEN,
    variables: {
      userId,
      refreshToken: _refreshToken,
    },
  })
  console.log('REFRESH TOKEN!', response.data)

  const token = response.data.refreshToken.access_token
  const refreshToken = response.data.refreshToken.refresh_token
  const expireDate = response.data.refreshToken.expire_date

  await storage.setStringAsync(EncryptedStorageKeys.AccessToken, token)
  await storage.setStringAsync(EncryptedStorageKeys.RefreshToken, refreshToken)
  await storage.setStringAsync(
    EncryptedStorageKeys.AccessTokenExpireDate,
    expireDate,
  )

  return { token, expireDate }
}
