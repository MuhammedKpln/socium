import MMKVStorage, { create } from 'react-native-mmkv-storage'

export enum EncryptedStorageKeys {
  IsFirstJoined = 'is-first-joined',
  AccessToken = 'access-token',
  RefreshToken = 'refresh-token',
  FcmToken = 'fcm_token',
  NextAdDateTime = 'next_ad_date_time',
  AccessTokenExpireDate = 'access-token-expire-date',
}

export const storage = new MMKVStorage.Loader().initialize()
export const useStorage = create(storage)
