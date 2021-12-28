import { Toast } from '@/components/Toast/Toast.component'
import { updateTheme } from '@/store/reducers/theme.reducer'
import { configureDesignSystem } from '@/theme/designSystem'
import { toastRef } from '@/utils/toast'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { useCallback, useEffect, useState } from 'react'
import { StatusBar, useColorScheme } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useDispatch } from 'react-redux'
import BottomTabBarNavigator from './BottomTabNavigator'
import { navigationRef } from './utils/navigation'

const Stack = createNativeStackNavigator()

// @refresh reset
const ApplicationNavigator = () => {
  const colorScheme = useColorScheme()
  const dispatch = useDispatch()

  const [ready, setReady] = useState(false)

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
    <SafeAreaProvider style={{ flex: 1 }}>
      <NavigationContainer ref={navigationRef}>
        <StatusBar />
        <Toast ref={toastRef} />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={BottomTabBarNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

export default ApplicationNavigator
