import { Toast } from '@/components/Toast/Toast.component'
import { useAppSelector } from '@/store'
import { updateTheme } from '@/store/reducers/theme.reducer'
import { configureDesignSystem } from '@/theme/designSystem'
import { toastRef } from '@/utils/toast'
import { NavigationContainer, Theme } from '@react-navigation/native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { StatusBar, useColorScheme } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Colors } from 'react-native-ui-lib'
import ConnectionStatusBar from 'react-native-ui-lib/connectionStatusBar'
import { useDispatch } from 'react-redux'
import MainNavigator from './BottomTabNavigator'
import { navigationRef } from './utils/navigation'

// @refresh reset
const ApplicationNavigator = () => {
  const colorScheme = useColorScheme()
  const dispatch = useDispatch()
  const theme = useAppSelector(state => state.themeReducer.theme)
  const [ready, setReady] = useState(false)

  const navigationTheme = useMemo<Theme>((): Theme => {
    return {
      colors: {
        background: Colors.screenBG,
        card: Colors.navigationSurfaceBG,
        text: Colors.textColor,
        primary: Colors.primary,
        border: Colors.navigationSurfaceBG,
        notification: Colors.navigationSurfaceBG,
      },
      dark: theme === 'dark' ? true : false,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, ready])

  const startApp = useCallback(async () => {
    configureDesignSystem()
    dispatch(
      updateTheme({
        theme: colorScheme === 'dark' ? 'dark' : 'light',
      }),
    )
    setReady(true)
  }, [colorScheme, dispatch])

  useEffect(() => {
    startApp()
  }, [startApp])

  if (!ready) return null

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef} theme={navigationTheme}>
        <StatusBar />
        <MainNavigator />
        <ConnectionStatusBar
          useAbsolutePosition
          label="Lütfen internet bağlantınızı kontrol ediniz."
        />
      </NavigationContainer>
      <Toast ref={toastRef} />
    </SafeAreaProvider>
  )
}

export default ApplicationNavigator
