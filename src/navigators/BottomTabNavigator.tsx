import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
import { Image } from 'react-native-ui-lib'
import HomeContainer from '../containers/Home/Home.container'

const Tab = createBottomTabNavigator()

// @refresh reset
const BottomTabBarNavigator = () => {
  return (
    <Tab.Navigator
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
      <Tab.Screen name="Home" component={HomeContainer} />
      <Tab.Screen name="Home2" component={HomeContainer} />
    </Tab.Navigator>
  )
}

export default BottomTabBarNavigator
