import { ParamListBase } from '@react-navigation/native'

export enum Routes {
  App = 'app',
  Home = 'home',
  Login = 'login',
  Register = 'register',
  EmailVerification = 'EmailVerification',
}
export enum RouteTitles {
  Login = 'Giriş yap',
}

export const applyRouteTitle = (title: RouteTitles, args?: object): object => {
  return {
    options: {
      title: title,
      ...args,
    },
  }
}

export const RouteComponents = {
  Login: () => require('@/containers/Login/Login.container').LoginContainer,
}

export interface INavigatorParamsList extends ParamListBase {
  [Routes.Home]: undefined
  [Routes.Login]: undefined
  [Routes.EmailVerification]: undefined
}
