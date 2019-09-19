import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, AsyncStorage } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import MapView from 'react-native-maps'
import LoginScreen from '../screens/LoginScreen'


export default class AddHubScreen extends Component{
    constructor(){
        super()
        this.retrieveData('jwt');
    }

    retrieveData = async (key) => {
        const jwtToken = await AsyncStorage.getItem(key);

        // await AsyncStorage.removeItem('jwt')
        alert(jwtToken)
        this.props.navigation.navigate(jwtToken === null ? 'Login' : "AddHub")
    };

    testFunc = () => {
        return <View>test</View>
    }

    checkLogin = () => {
        if(this.retrieveData()){
            return(
                <View style={styles.container}>
                    <MapView
                        style={{ flex: 1 }}
                        initialRegion={initialCoords}
                    >

                    </MapView>

                </View> 
            )
        } else {
            return <LoginScreen />
        }
    }

    render(){
            return(
                <View style={styles.container}>
                    <MapView
                        style={{ flex: 1 }}
                        initialRegion={initialCoords}
                    >

                    </MapView>

                </View> 
            )
        }
    
}

const initialCoords = {
    latitude: 41.8781,
    longitude: -87.6298,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
}



AddHubScreen.navigationOptions = {
    title: 'Add A Hub',
    headerStyle: {
        backgroundColor: '#1675AA',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
        fontWeight: 'bold',
    },
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: '#fff',
    },
});
