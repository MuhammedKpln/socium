import { Routes } from '@/navigators/navigator.props'
import {
  navigate,
  navigateAndSimpleReset,
  navigationRef,
} from '@/navigators/utils/navigation'
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

export function withEmailVerified(Component: any) {
  const isLoggedIn = store.getState().userReducer.isLoggedIn
  const user = store.getState().userReducer.user

  if (isLoggedIn) {
    if (!user?.isEmailConfirmed) {
      setTimeout(() => {
        if (navigationRef.current?.isReady) {
          return navigateAndSimpleReset(Routes.EmailVerification)
        }
      }, 100)
    }
  }

  return Component
}
