import { ParamListBase } from '@react-navigation/native'

export enum Routes {
  App = 'app',
  Home = 'home',
  Login = 'login',
  Register = 'register',
  EmailVerification = 'EmailVerification',
  PostDetails = 'post-details',
  MyProfile = 'profile',
  Settings = 'app-settings',
  Discover = 'discover',
  Match = 'pair',
  Chat = 'chat',
  EarnStar = 'earn-star',
  NewPost = 'new-post',
  ImageGallery = 'image-gallery',
}
export enum RouteTitles {
  Login = 'Giriş yap',
  Register = 'Kayıt ol',
  Settings = 'Ayarlar',
  Discover = 'Keşfet',
  MyProfile = 'Profilim',
  Chat = 'Sohbet',
  EarnStar = 'Puan kazan',
  NewPost = 'Yeni gönderi',
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
  Chat: () => require('@/containers/Chats/Chats.container').ChatsContainer,
  EarnStar: () =>
    require('@/containers/EarnStar/EarnStar.container').EarnStarContainer,
  NewPost: () =>
    require('@/containers/NewPost/NewPost.container').NewPostContainer,
  ImageGallery: () =>
    require('@/containers/ImageGallery/ImageGallery.container')
      .ImageGalleryContainer,
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
  [Routes.Chat]: undefined
  [Routes.EarnStar]: undefined
  [Routes.NewPost]: undefined
  [Routes.ImageGallery]: { imageSet: string[] }
}
