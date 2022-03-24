import { Toast } from '@/components/Toast/Toast.component'
import { useAppSelector } from '@/store'
import { updateTheme } from '@/store/reducers/theme.reducer'
import { toastRef } from '@/utils/toast'
import { NavigationContainer, Theme } from '@react-navigation/native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Linking, StatusBar, useColorScheme } from 'react-native'
import { Notifications } from 'react-native-notifications'
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context'
import { Colors } from 'react-native-ui-lib'
import ConnectionStatusBar from 'react-native-ui-lib/connectionStatusBar'
import { useDispatch } from 'react-redux'
import MainNavigator from './BottomTabNavigator'
import { Routes } from './navigator.props'
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

  const linkingOptions = {
    screens: {
      [Routes.PostDetails]: {
        path: 'post/:postId',
        parse: {
          postId: postId => Number(postId),
        },
      },
      [Routes.Chat]: {
        path: 'message-room/:roomId',
        parse: {
          roomId: roomId => Number(roomId),
        },
      },
    },
  }

  const linking = {
    prefixes: ['com.socium://', 'https://derdevam.com'],
    config: linkingOptions,
    async getInitialURL() {
      const url = await Linking.getInitialURL()

      if (url != null) {
        return url
      }

      const message = await Notifications.getInitialNotification()

      if (message) {
        return message.payload?.link
      }
    },

    subscribe(listener) {
      const onReceiveURL = ({ url }: { url: string }) => listener(url)

      const unsubscribeNotification =
        Notifications.events().registerNotificationOpened(
          (notification, completion: () => void) => {
            if (notification) {
              const url = notification.payload?.link
              if (url) {
                listener(url)
              }
            }
            completion()
          },
        )

      Linking.addEventListener('url', onReceiveURL)

      return () => {
        Linking.removeAllListeners('url')
        unsubscribeNotification.remove()
      }
    },
  }

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <NavigationContainer
        ref={navigationRef}
        theme={navigationTheme}
        linking={linking}
      >
        <StatusBar />
        <MainNavigator />
        <ConnectionStatusBar
          useAbsolutePosition
          label="Lütfen internet bağlantınızı kontrol ediniz."
        />
        <Toast ref={toastRef} />
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

export default ApplicationNavigator
