import { ParamListBase } from '@react-navigation/native'

export enum Routes {
  App = 'app',
  Home = 'home',
  Login = 'login',
  Register = 'register',
  EmailVerification = 'EmailVerification',
  PostDetails = 'post-details',
  Profile = 'profile',
  Settings = 'app-settings',
}
export enum RouteTitles {
  Login = 'Giriş yap',
  Register = 'Kayıt ol',
  Settings = 'Ayarlar',
}

export const RouteComponents = {
  Login: () => require('@/containers/Login/Login.container').LoginContainer,
  Register: () =>
    require('@/containers/Register/Register.container').RegisterContainer,
  PostDetails: () =>
    require('@/containers/PostDetails/PostDetails.container').PostDetails,
  Settings: () =>
    require('@/containers/Settings/Settings.container').SettingsContainer,
}

export interface INavigatorParamsList extends ParamListBase {
  [Routes.App]: undefined
  [Routes.Home]: undefined
  [Routes.Login]: undefined
  [Routes.Register]: undefined
  [Routes.EmailVerification]: undefined
  [Routes.Profile]: undefined
  [Routes.PostDetails]: { postId: number }
}
