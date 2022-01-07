import { HeaderRight } from '@/components/Navigation/HeaderRight.component'
import { HeaderTitle } from '@/components/Navigation/HeaderTitle.component'
import { SettingsContainer } from '@/containers/Settings/Settings.container'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import HomeContainer from '../containers/Home/Home.container'
import { RouteComponents, Routes, RouteTitles } from './navigator.props'
import { applyRouteTitle, applyTabIcon } from './utils/navigation'

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

// @refresh reset
const BottomTabBarNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName={Routes.Home}
      detachInactiveScreens
      screenOptions={{
        headerTitleAlign: 'left',
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name={Routes.Home}
        component={HomeContainer}
        {...applyTabIcon('home', {
          headerTitle: () => <HeaderTitle />,
          headerRight: () => <HeaderRight />,
        })}
      />
      <Tab.Screen
        name={Routes.Profile}
        component={HomeContainer}
        {...applyTabIcon('compass')}
      />
      <Tab.Screen
        name={Routes.Register}
        component={HomeContainer}
        {...applyTabIcon('Untitled')}
      />
      <Tab.Screen
        name={Routes.EmailVerification}
        component={SettingsContainer}
        {...applyTabIcon('fire')}
      />
    </Tab.Navigator>
  )
}

const MainNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={Routes.App}>
      <Stack.Group screenOptions={{ headerShown: false }}>
        {/* // Header disabled routes */}
        <Stack.Screen name={Routes.App} component={BottomTabBarNavigator} />
      </Stack.Group>
      <Stack.Group
        screenOptions={{
          headerTitleAlign: 'left',
          headerShadowVisible: false,
          title: '',
        }}
      >
        <Stack.Screen
          name={Routes.Login}
          getComponent={RouteComponents.Login}
          {...applyRouteTitle(RouteTitles.Login)}
        />
        <Stack.Screen
          name={Routes.Register}
          getComponent={RouteComponents.Register}
          {...applyRouteTitle(RouteTitles.Register)}
        />
        <Stack.Screen
          name={Routes.PostDetails}
          getComponent={RouteComponents.PostDetails}
        />
      </Stack.Group>
    </Stack.Navigator>
  )
}

export default MainNavigator
