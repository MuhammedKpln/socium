import PlusFilled from '@/assets/icons/PlusFilled'
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
      detachInactiveScreens
      screenOptions={{
        headerTitleAlign: 'left',
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name={Routes.Home}
        component={HomeContainer}
        options={{
          ...applyTabIcon('home'),
          ...{
            headerTitle: () => <HeaderTitle />,
            headerRight: () => <HeaderRight />,
          },
        }}
      />
      <Tab.Screen
        name={'qwe'}
        getComponent={RouteComponents.PostDetails}
        options={{
          ...applyTabIcon('compass'),
          ...applyRouteTitle(RouteTitles.Discover),
          ...{
            headerRight: () => <HeaderRight />,
          },
        }}
      />
      <Tab.Screen
        name={Routes.Discover}
        getComponent={RouteComponents.Discover}
        options={{
          tabBarIcon: () => (
            <PlusFilled style={{ marginLeft: 40, marginTop: 10 }} />
          ),
          ...applyRouteTitle(RouteTitles.Discover),
          ...{
            headerRight: () => <HeaderRight />,
          },
        }}
      />
      <Tab.Screen
        name={Routes.Match}
        getComponent={RouteComponents.Match}
        options={{ ...applyTabIcon('fire'), ...applyRouteTitle('') }}
      />
      <Tab.Screen
        name={Routes.Register}
        component={HomeContainer}
        options={{ ...applyTabIcon('chatcirlce') }}
      />
    </Tab.Navigator>
  )
}

const MainNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={Routes.App}
      screenOptions={{
        headerBackTitle: '',
        headerTitleStyle: {
          fontFamily: 'Gilroy-Semibold',
          fontWeight: '600',
        },
      }}
    >
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
        <Stack.Screen
          name={Routes.Settings}
          getComponent={RouteComponents.Settings}
          options={applyRouteTitle(RouteTitles.Settings)}
        />
        <Stack.Screen
          name={Routes.MyProfile}
          getComponent={RouteComponents.MyProfile}
          options={applyRouteTitle(RouteTitles.MyProfile)}
        />
      </Stack.Group>
    </Stack.Navigator>
  )
}

export default MainNavigator
