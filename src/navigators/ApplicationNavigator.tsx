import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import BottomTabBarNavigator from './BottomTabNavigator';
import {navigationRef} from './utils/navigation';

const Stack = createNativeStackNavigator();

// @refresh reset
const ApplicationNavigator = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <NavigationContainer ref={navigationRef}>
        <StatusBar />
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Main" component={BottomTabBarNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default ApplicationNavigator;
