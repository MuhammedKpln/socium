import { Config } from '@/Config'

export const avatarStatic = (avatar: string) => {
  return `${Config.STATIC_URL}/avatars/${avatar}.webp`
}

export const staticFile = (fileUrl: string) => {
  return `${Config.STATIC_URL}/${fileUrl}`
}
