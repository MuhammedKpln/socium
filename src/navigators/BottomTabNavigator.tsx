import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import HomeContainer from '../containers/Home/Home.container';

const Tab = createBottomTabNavigator();

// @refresh reset
const BottomTabBarNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeContainer} />
    </Tab.Navigator>
  );
};

export default BottomTabBarNavigator;
