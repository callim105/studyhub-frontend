import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import MainTabNavigator from './MainTabNavigator';
import HomeScreen from '../screens/HomeScreen'
import AuthLoadingScreen from '../screens/AuthLoading';
import AuthStack from '../navigation/AuthNavigator'



export default createAppContainer(
  createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    AuthLoading: AuthLoadingScreen,
    Main: MainTabNavigator,
    Auth: AuthStack,
  },
  {
      initialRouteName: 'AuthLoading',
  }
  )
);
