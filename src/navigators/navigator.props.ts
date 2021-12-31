import { ParamListBase } from '@react-navigation/native'

export enum Routes {
  Home = 'home',
  Login = 'login',
  EmailVerification = 'EmailVerification',
}

export interface INavigatorParamsList extends ParamListBase {
  [Routes.Home]: undefined
  [Routes.Login]: undefined
  [Routes.EmailVerification]: undefined
}
