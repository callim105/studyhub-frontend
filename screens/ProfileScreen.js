import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import { AsyncStorage } from 'react-native';


export default class ProfileScreen extends Component {
    
    constructor(){
        super()
        this.state = {
            currentUser: {}
        }
        
    }

    async componentDidMount(){
        const user = await this._retrieveData('user')
        this.setState({currentUser: JSON.parse(user)})
    }



    _retrieveData = async (key) => {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
              // We have data!!
              return value
            }
        } catch (error) {
          // Error retrieving data
          console.log('error')
        }
    };

    handleLogOut = () => {
        AsyncStorage.removeItem('jwt')
        AsyncStorage.removeItem('user')
        props.navigation.navigate('Auth')
    }

    hasDataRender = () => {
        // console.log(this.state.currentUser)
        if(this.state.currentUser.username){
            return (
            <View>
                <Text>Your Profile</Text>
                <Text>Username: {this.state.currentUser.username}</Text>
                <Text>{this.state.currentUser.id}</Text>
                <Button title="Log Out" onPress={this.handleLogOut} />
            </View>)
            
        } else {
    
            return(
            <View>
                <Text>Your Profile</Text>
                <Text>Loading </Text>
                <Button title="Log Out" onPress={this.handleLogOut} />
            </View>)
        }
    }

    render(){
        console.log(this.state.currentUser)
        return(
            <View>
                {this.hasDataRender()}
            </View>
        )
    }
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
