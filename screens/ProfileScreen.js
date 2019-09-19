import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import { View, Text, Button } from 'react-native';
import { AsyncStorage } from 'react-native';


export default function ProfileScreen(props) {
    /**
     * Go ahead and delete ExpoConfigView and replace it with your content;
     * we just wanted to give you a quick view of your config.
     */

    handleLogOut = () => {
        AsyncStorage.removeItem('jwt')
        props.navigation.navigate('Auth')
    }

    return (
        <View>
            <Text>Your Profile</Text>
            <Button title="Log Out" onPress={handleLogOut} />
        </View>
    );
}

ProfileScreen.navigationOptions = {
    title: 'Profile',
    headerStyle: {
        backgroundColor: '#1675AA',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
        fontWeight: 'bold',
    },
};
