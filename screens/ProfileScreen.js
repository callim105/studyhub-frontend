import React, { Component } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import { AsyncStorage } from 'react-native';
import Profile from '../components/Profile'
import { connect } from 'react-redux';
import { fetchUser } from '../redux/actions/userActions'

class ProfileScreen extends Component {
    
    componentDidMount(){
        this.props.fetchUser()
    }

    handleLogOut = () => {
        AsyncStorage.removeItem('jwt')
        this.props.navigation.navigate('Auth')
    }

    render(){
        return(
            <View style={styles.screen}>
                <Profile handleLogOut={this.handleLogOut}/>
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
    headerRight:(<Image source={require("../assets/images/study_logo.png")} style={{height: 35, width: 35}}/>)
};

const styles = StyleSheet.create({
    screen:{
        backgroundColor:'#e9ebee'
    }
})

export default connect(null, { fetchUser })(ProfileScreen)