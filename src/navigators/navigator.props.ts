import { ParamListBase } from '@react-navigation/native'

export enum Routes {
  Home = 'home',
  Login = 'login',
}

export interface INavigatorParamsList extends ParamListBase {
  [Routes.Home]: undefined
  [Routes.Login]: undefined
}
