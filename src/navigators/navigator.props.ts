import { ParamListBase } from '@react-navigation/native'

export enum Routes {
  App = 'app',
  Home = 'home',
  Login = 'login',
  Register = 'register',
  EmailVerification = 'EmailVerification',
  Post = 'post',
  Profile = 'profile',
}
export enum RouteTitles {
  Login = 'Giriş yap',
  Register = 'Kayıt ol',
}

export const RouteComponents = {
  Login: () => require('@/containers/Login/Login.container').LoginContainer,
  Register: () =>
    require('@/containers/Register/Register.container').RegisterContainer,
}

export interface INavigatorParamsList extends ParamListBase {
  [Routes.Home]: undefined
  [Routes.Login]: undefined
  [Routes.EmailVerification]: undefined
}
