import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { Image } from 'react-native-ui-lib'
import HomeContainer from '../containers/Home/Home.container'
import {
  applyRouteTitle,
  RouteComponents,
  Routes,
  RouteTitles,
} from './navigator.props'

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

// @refresh reset
const BottomTabBarNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName={Routes.Home}
      screenOptions={{
        headerRight: () => (
          <Image
            source={{
              uri: 'https://avatars.dicebear.com/api/miniavs/your-custom-seed.png',
            }}
            width={30}
            height={30}
          />
        ),
        headerTitleAlign: 'left',
      }}
    >
      <Tab.Screen name={Routes.Home} component={HomeContainer} />
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
      <Stack.Screen
        name={Routes.Login}
        getComponent={RouteComponents.Login}
        {...applyRouteTitle(RouteTitles.Login)}
      />
    </Stack.Navigator>
  )
}

export default MainNavigator
