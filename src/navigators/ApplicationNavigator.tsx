import { Toast } from '@/components/Toast/Toast.component'
import { useAppSelector } from '@/store'
import { updateTheme } from '@/store/reducers/theme.reducer'
import { configureDesignSystem } from '@/theme/designSystem'
import { toastRef } from '@/utils/toast'
import { NavigationContainer, Theme } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { StatusBar, useColorScheme } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Colors } from 'react-native-ui-lib'
import ConnectionStatusBar from 'react-native-ui-lib/connectionStatusBar'
import { useDispatch } from 'react-redux'
import BottomTabBarNavigator from './BottomTabNavigator'
import { navigationRef } from './utils/navigation'

const Stack = createNativeStackNavigator()

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
        card: Colors.surfaceBG,
        text: Colors.textColor,
        primary: Colors.primary,
        border: Colors.surfaceBG,
        notification: Colors.surfaceBG,
      },
      dark: theme === 'dark' ? true : false,
    }
  }, [theme])

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
        <Toast ref={toastRef} />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={BottomTabBarNavigator} />
        </Stack.Navigator>
        <ConnectionStatusBar
          useAbsolutePosition
          label="Lütfen internet bağlantınızı kontrol ediniz."
        />
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

export default ApplicationNavigator
