import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import { AsyncStorage } from 'react-native';
import Profile from '../components/Profile'
import { connect } from 'react-redux';
import { fetchUser } from '../redux/actions/userActions'

class ProfileScreen extends Component {
    
    constructor(){
        super()
        this.state = {
            
        }
        
    }

    componentDidMount(){
        this.props.fetchUser()
        
    }



    handleLogOut = () => {
        AsyncStorage.removeItem('jwt')
        this.props.navigation.navigate('Auth')
    }

    hasDataRender = () => {
        // console.log(this.state.currentUser)
        if(true){
            return (
            <Profile handleLogOut={this.handleLogOut}/>
            )
            
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

export default connect(null, { fetchUser })(ProfileScreen)