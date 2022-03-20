import type { IUser } from '@/Types/login.types'
import type { IRoom } from '@/types/messages.types'
import type { IZodiac } from '@/utils/zodiac'
import type { ParamListBase } from '@react-navigation/native'
import type { RTCSessionDescriptionType } from 'react-native-webrtc'

export enum Routes {
  App = 'app',
  Home = 'home',
  Login = 'login',
  Register = 'register',
  EmailVerification = 'EmailVerification',
  PostDetails = 'post-details',
  MyProfile = 'my-profile',
  Settings = 'app-settings',
  Discover = 'discover',
  Match = 'pair',
  Chats = 'chats',
  EarnStar = 'earn-star',
  NewPost = 'new-post',
  ImageGallery = 'image-gallery',
  Chat = 'chat',
  MatchChat = 'match-chat',
  MatchingFound = 'matching-found',
  ChangeAvatar = 'change-avatar',
  Followers = 'followers',
  CallComing = 'call-coming',
  Calling = 'calling',
  Call = 'call',
  ConnectToSpotify = 'connect-to-spotify',
  Zodiac = 'zodiac',
  Notifications = 'notifications',
  Profile = 'profile',
  EditProfile = 'edit-profile',
  Onboarding = 'onboarding',
}
export enum RouteTitles {
  Login = 'Giriş yap',
  Register = 'Kayıt ol',
  Settings = 'Ayarlar',
  Discover = 'Keşfet',
  MyProfile = 'Profilim',
  Chats = 'Sohbet',
  EarnStar = 'Puan kazan',
  NewPost = 'Yeni gönderi',
  ChangeAvatar = 'Profil resmini değiştir',
  ConnectToSpotify = 'Spotify ile bağlan',
  Zodiac = 'Socium burç',
  Notifications = 'Bildirimler',
  EditProfile = "Profilim'i düzenle",
}

export const RouteComponents = {
  Login: () => require('@/containers/Login/Login.container').LoginContainer,
  Register: () =>
    require('@/containers/Register/Register.container').RegisterContainer,
  PostDetails: () =>
    require('@/containers/PostDetails/PostDetails.container').PostDetails,
  Settings: () =>
    require('@/containers/Settings/Settings.container').SettingsContainer,
  Discover: () =>
    require('@/containers/Discover/Discover.container').DiscoverContainer,
  MyProfile: () =>
    require('@/containers/Profile/Profile.container').ProfileContainer,
  Match: () => require('@/containers/Match/Match.container').MatchContainer,
  Chats: () => require('@/containers/Chats/Chats.container').ChatsContainer,
  EarnStar: () =>
    require('@/containers/EarnStar/EarnStar.container').EarnStarContainer,
  NewPost: () =>
    require('@/containers/NewPost/NewPost.container').NewPostContainer,
  ImageGallery: () =>
    require('@/containers/ImageGallery/ImageGallery.container')
      .ImageGalleryContainer,
  Chat: () => require('@/containers/Chat/Chat.container').ChatContainer,
  MatchChat: () =>
    require('@/containers/Match/MatchChat.container').MatchChatContainer,
  ChangeAvatar: () =>
    require('@/containers/ChangeAvatar/ChangeAvatar.container')
      .ChangeAvatarContainer,
  Followers: () =>
    require('@/containers/Followers/Followers.container').FollowersContainer,
  CallComing: () =>
    require('@/containers/Match/CallComing.component').CallComing,
  Calling: () => require('@/containers/Match/Calling.component').Calling,
  Call: () => require('@/containers/Match/Call.component').CallContainer,
  MatchingFound: () =>
    require('@/containers/Match/containers/MatchingFound.container')
      .MatchingFoundContainer,
  ConnectToSpotify: () =>
    require('@/containers/ConnectToSpotify/ConnectToSpotify.container')
      .ConnectToSpotifyContainer,
  Zodiac: () => require('@/containers/Zodiac/Zodiac.container').ZodiacContainer,
  Notifications: () =>
    require('@/containers/Notifications/Notifications.container')
      .NotificationContainer,
  Profile: () =>
    require('@/containers/Profile/Profile.container').ProfileContainer,
  EditProfile: () =>
    require('@/containers/EditProfile/EditProfile.container')
      .EditProfileContainer,
  Onboarding: () =>
    require('@/containers/Onboarding/Onboarding.container').OnboardingContainer,
}

export interface INavigatorParamsList extends ParamListBase {
  [Routes.App]: undefined
  [Routes.Home]: undefined
  [Routes.Login]: undefined
  [Routes.Register]: undefined
  [Routes.EmailVerification]: undefined
  [Routes.MyProfile]: { username: string }
  [Routes.PostDetails]: { postId: number }
  [Routes.Match]: undefined
  [Routes.Chats]: undefined
  [Routes.EarnStar]: undefined
  [Routes.NewPost]: undefined
  [Routes.ImageGallery]: { imageSet: string[] }
  [Routes.Chat]: { room: IRoom; user: IUser }
  [Routes.MatchChat]: { room: string; user: IUser; uuid: string }
  [Routes.ChangeAvatar]: undefined
  [Routes.Followers]: { userId: number; username: string }
  [Routes.CallComing]: {
    username: string
    offer: RTCSessionDescriptionType
    uuid: string
  }
  [Routes.Calling]: {
    username: string
    avatar: string
  }
  [Routes.Call]: {
    username: string
    avatar: string
    isMuted: boolean
  }
  [Routes.MatchingFound]: {
    user: IUser
    room: string
    uuid: string
  }
  [Routes.ConnectToSpotify]: undefined
  [Routes.Zodiac]: {
    currentZodiac: IZodiac
  }
  [Routes.Notifications]: undefined
  [Routes.Profile]: { username: string }
  [Routes.EditProfile]: undefined
  [Routes.Onboarding]: undefined
}
