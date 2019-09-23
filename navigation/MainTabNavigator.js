import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createSwitchNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import AddHubScreen from '../screens/AddHubScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HubShowScreen from '../screens/HubShowScreen';




//Check for jwt
// const _retrieveData = async (key) => {
//     try {
//       const value = await AsyncStorage.getItem(key);
//       if (value !== null) {
//         // We have data!!
//         //This is a thing
//         return value;
//       } else {
//         return false;
//       }
//     } catch (error) {
//       // Error retrieving data
//     }
// };

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
    HubShow: HubShowScreen
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

HomeStack.path = '';

const AddHubStack = createStackNavigator(
  {
    AddHub: AddHubScreen
  },
  config
);

AddHubStack.navigationOptions = {
  tabBarLabel: 'Add a Hub',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-add-circle-outline' : 'md-link'} />
  ),
};

AddHubStack.path = '';

const ProfileStack = createStackNavigator(
  {
    Profile: ProfileScreen,
  },
  config
);

ProfileStack.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-contact' : 'md-contact'} />
  ),
};

ProfileStack.path = '';

const tabNavigator = createBottomTabNavigator({
    HomeStack,
    AddHubStack,
    ProfileStack,
    },
    {
    backBehavior: "initialRoute"
    }
);

tabNavigator.path = '';

export default tabNavigator;
