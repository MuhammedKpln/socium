import { Routes } from '@/navigators/navigator.props'
import { navigate } from '@/navigators/utils/navigation'
import { store } from '@/store'
import { showToast, ToastStatus } from './toast'

export function authRequiredFunction(func: any) {
  const isLoggedIn = store.getState().userReducer.isLoggedIn

  if (!isLoggedIn) {
    showToast(
      ToastStatus.Info,
      'Bu eylemi gerçekleştirebilmeniz için giriş yapmalısınız.',
    )
    return navigate(Routes.Login, {})
  } else {
    return func()
  }
}
