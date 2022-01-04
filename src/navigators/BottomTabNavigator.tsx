import { HeaderRight } from '@/components/Navigation/HeaderRight.component'
import { HeaderTitle } from '@/components/Navigation/HeaderTitle.component'
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
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
      detachInactiveScreens
    >
      <Tab.Screen
        name={Routes.Home}
        component={HomeContainer}
        {...applyTabIcon('home')}
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
        component={HomeContainer}
        {...applyTabIcon('fire')}
      />
      <Tab.Screen
        name={Routes.Post}
        component={HomeContainer}
        {...applyTabIcon('chat')}
      />
    </Tab.Navigator>
  )
}

const MainNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={Routes.App}
      screenOptions={{
        title: 'Ana sayfa',
        headerTitle: () => <HeaderTitle />,
        headerRight: () => <HeaderRight />,
        headerShadowVisible: false,
        headerTitleAlign: 'left',
        headerShown: true,
      }}
    >
      <Stack.Group>
        {/* // Header disabled routes */}
        <Stack.Screen name={Routes.App} component={BottomTabBarNavigator} />
      </Stack.Group>
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
    </Stack.Navigator>
  )
}

export default MainNavigator
