import PlusFilled from '@/assets/icons/PlusFilled'
import { HeaderRight } from '@/components/Navigation/HeaderRight.component'
import { HeaderTitle } from '@/components/Navigation/HeaderTitle.component'
import { useAppSelector } from '@/store'
import { authRequiredFunction } from '@/utils/auth'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
        name={Routes.Discover}
        getComponent={RouteComponents.Discover}
        options={{
          ...applyTabIcon('compass'),
          ...applyRouteTitle(RouteTitles.Discover),
          ...{
            headerRight: () => <HeaderRight />,
          },
        }}
      />
      <Tab.Screen
        name={'s'}
        getComponent={() => RouteComponents.NewPost}
        options={{
          unmountOnBlur: true,
          tabBarIcon: () => (
            <PlusFilled style={{ marginLeft: 40, marginTop: 10 }} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault()
            authRequiredFunction(() => navigation.navigate(Routes.NewPost))
          },
        })}
      />
      <Tab.Screen
        name={Routes.Match}
        getComponent={RouteComponents.Match}
        options={{ ...applyTabIcon('fire'), ...applyRouteTitle('') }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault()
            authRequiredFunction(() => navigation.navigate(Routes.Match))
          },
        })}
      />
      <Tab.Screen
        name={Routes.Chats}
        getComponent={RouteComponents.Chats}
        options={{
          ...applyTabIcon('chatcirlce'),
          ...applyRouteTitle(RouteTitles.Chats),
          headerRight: () => <HeaderRight />,
        }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault()
            authRequiredFunction(() => navigation.navigate(Routes.Chats))
          },
        })}
      />
    </Tab.Navigator>
  )
}

const MainNavigator = () => {
  const firstStart = useAppSelector(state => state.appReducer.firstStart)
  console.log(firstStart)
  return (
    <Stack.Navigator
      initialRouteName={firstStart ? Routes.Onboarding : Routes.Home}
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
        <Stack.Screen
          name={Routes.Onboarding}
          getComponent={RouteComponents.Onboarding}
        />
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
        <Stack.Screen name={Routes.Chat} getComponent={RouteComponents.Chat} />
        <Stack.Screen
          name={Routes.MatchChat}
          getComponent={RouteComponents.MatchChat}
        />
      </Stack.Group>

      <Stack.Group
        screenOptions={{
          presentation: 'modal',
          headerShown: true,
          title: '',
        }}
      >
        <Stack.Screen
          name={Routes.EarnStar}
          options={{ ...applyRouteTitle(RouteTitles.EarnStar) }}
          getComponent={RouteComponents.EarnStar}
        />
        <Stack.Screen
          name={Routes.NewPost}
          options={{ ...applyRouteTitle(RouteTitles.NewPost) }}
          getComponent={RouteComponents.NewPost}
        />
        <Stack.Screen
          name={Routes.ChangeAvatar}
          options={{ ...applyRouteTitle(RouteTitles.ChangeAvatar) }}
          getComponent={RouteComponents.ChangeAvatar}
        />
        <Stack.Screen
          name={Routes.Followers}
          getComponent={RouteComponents.Followers}
        />
        <Stack.Screen
          name={Routes.Call}
          getComponent={RouteComponents.Call}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={Routes.ConnectToSpotify}
          getComponent={RouteComponents.ConnectToSpotify}
          options={{ ...applyRouteTitle(RouteTitles.ConnectToSpotify) }}
        />
        <Stack.Screen
          name={Routes.Zodiac}
          getComponent={RouteComponents.Zodiac}
          options={{ ...applyRouteTitle(RouteTitles.Zodiac) }}
        />
        <Stack.Screen
          name={Routes.Notifications}
          getComponent={RouteComponents.Notifications}
          options={{
            ...applyRouteTitle(''),
          }}
        />
        <Stack.Screen
          name={Routes.Profile}
          getComponent={RouteComponents.Profile}
        />
        <Stack.Screen
          name={Routes.EditProfile}
          options={{ ...applyRouteTitle(RouteTitles.EditProfile) }}
          getComponent={RouteComponents.EditProfile}
        />
      </Stack.Group>
      <Stack.Group
        screenOptions={{
          presentation: 'transparentModal',
          headerShown: false,
        }}
      >
        <Stack.Screen
          name={Routes.ImageGallery}
          getComponent={RouteComponents.ImageGallery}
        />
        <Stack.Screen
          name={Routes.CallComing}
          getComponent={RouteComponents.CallComing}
        />
        <Stack.Screen
          name={Routes.Calling}
          getComponent={RouteComponents.Calling}
        />
        <Stack.Screen
          name={Routes.MatchingFound}
          getComponent={RouteComponents.MatchingFound}
        />
      </Stack.Group>
    </Stack.Navigator>
  )
}

export default MainNavigator
