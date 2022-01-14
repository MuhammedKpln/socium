/**
 * Used to navigating without the navigation prop
 * @see https://reactnavigation.org/docs/navigating-without-navigation-prop/
 *
 * You can add other navigation functions that you need and export them
 */
import { Icon } from '@/components/Icon/Icon.component'
import {
  CommonActions,
  createNavigationContainerRef,
} from '@react-navigation/native'
import React from 'react'
import { Colors } from 'react-native-ui-lib'
import { Routes, RouteTitles } from '../navigator.props'

export const navigationRef = createNavigationContainerRef()

//@ts-ignore
export const navigate = (name, params) => {
  if (navigationRef.isReady()) {
    //@ts-ignore
    navigationRef.navigate(name, params)
  }
}

export const navigateAndReset = (routes = [], index = 0) => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index,
        routes,
      }),
    )
  }
}

//@ts-ignore
export const navigateAndSimpleReset = (name, index = 0) => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index,
        routes: [{ name }],
      }),
    )
  }
}

export function navigateBack() {
  if (navigationRef.current?.canGoBack()) {
    navigationRef.current?.goBack()
  } else {
    //@ts-ignore
    navigationRef.current?.navigate(Routes.App, {})
  }
}

export const applyRouteTitle = (title: RouteTitles | ''): object => {
  return {
    title: title,
  }
}

export const applyTabIcon = (iconName: string): object => {
  return {
    tabBarIcon: ({ focused }: { focused: boolean }) => (
      <Icon
        name={iconName}
        size={25}
        color={!focused ? Colors.bottomTabIcon : Colors.primary}
      />
    ),
  }
}
