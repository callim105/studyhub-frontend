import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import { View, Text } from 'react-native';
export default function ProfileScreen() {
  /**
   * Go ahead and delete ExpoConfigView and replace it with your content;
   * we just wanted to give you a quick view of your config.
   */
  return(
      <View>
          <Text>Your Profile</Text>
      </View>
  );
}

ProfileScreen.navigationOptions = {
  title: 'Profile',
  headerStyle: {
      backgroundColor: '#1675AA',
  },
  headerTintColor: '#fff',
  headerTitleStyle:{
      fontWeight: 'bold',
  },
};
