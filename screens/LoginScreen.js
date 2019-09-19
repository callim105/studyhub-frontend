import React, { Component } from 'react'
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';

import Colors from '../constants/Colors'
import { black } from 'ansi-colors';
import {AsyncStorage} from 'react-native';
import Constants from "expo-constants";
const { manifest } = Constants;
const loginUri = `http://${manifest.debuggerHost.split(':').shift()}:3000/login`;




export default class LoginScreen extends Component {
    constructor(){
        super()
        this.state = {
            username:'',
            password:''
        }
    }

    handleLogin = () => {
        this.fetchLogin()
    }

    _storeData = async (key1, val1, key2, val2) => {
        try {
          await AsyncStorage.multiSet([[key1, val1],[key2, val2]]);
        } catch (error) {
          // Error saving data
        }
    };

    _retrieveData = async (key) => {
        try {
          const value = await AsyncStorage.getItem(key);
          if (value !== null) {
            // We have data!!
            console.log(value);
          } else {
            console.log(value)
          }
        } catch (error) {
          // Error retrieving data
        }
      };

    //Function to facilitate login, store JWT in AsyncStorage
    fetchLogin = () => {
        fetch(loginUri, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accepts": "application/json"
            },
            body: JSON.stringify({
                user:{
                    username: this.state.username.toLowerCase(),
                    password: this.state.password
                }
            })
        })
        .then(res => res.json())
        .then(data => {
           this._storeData('user', JSON.stringify(data.user), 'jwt', JSON.stringify(data.jwt))
        })
        .then(() => {
            this._retrieveData('jwt')
            this._retrieveData('user')
            this.props.navigation.navigate('Main')
        })
        .catch(err => console.log(err))
    }


    render() {
        return (
            <View style={styles.screen}>
                <Image style={styles.logo}source={require('../assets/images/Study_Hub.png')} />
        
                <View style={styles.formInputHolder}>
                    <TextInput 
                        style={styles.usernameForm}
                        placeholder="Username"
                        onChangeText={text => this.setState({username: text})}
                        value={this.state.username}
                    />
                </View>
                <View style={styles.formInputHolder}>
                    <TextInput 
                        style={styles.usernameForm}
                        placeholder="Password"
                        onChangeText={text => this.setState({password: text})}
                        value={this.state.password}
                        secureTextEntry
                    />
                </View>
                <View style={styles.loginButtonContainer}>
                    <TouchableOpacity style={styles.loginButton} onPress={this.handleLogin}>
                        <Text style={styles.loginText}>Log In</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.loginOptions}>
                    <TouchableOpacity onPress={() => this._retrieveData('jwt')}>
                        <Text style={styles.loginOptionText} >
                            Forgot Password?
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.newUserContainer}>
                        <Text style={{color:'lightgrey'}}>
                            New user? 
                        </Text>
                        <TouchableOpacity>
                            <Text style={styles.loginOptionText}>
                            Sign up
                            </Text>
                        </TouchableOpacity>
                    </View>
                    
                </View>
                
                
            </View>
        )
    }
}

LoginScreen.navigationOptions = {
    headerStyle: {
        backgroundColor: '#1675AA',
    },

};

const styles = StyleSheet.create({
    screen:{
        flex: 1,
        backgroundColor: Colors.loginScreenColor,
        alignItems: 'center',
        paddingVertical: 100,
        justifyContent: 'flex-start'
        
    },
    logo:{
        width: 200,
        height: 200,
        
    },
    usernameForm:{
        height: 40,
        width: '50%',
        backgroundColor: 'white',
        opacity: 0.5,
        borderBottomWidth: 2,
        borderRadius: 0,
        alignItems: 'center',
        paddingLeft: 10
    },
    formInputHolder:{
        flexDirection: 'row',
        paddingBottom: 10,
    },
    loginButton:{
        backgroundColor:'#dce9f2',
        opacity: 0.7,
        borderRadius: 5,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'

    },
    loginButtonContainer:{
        width: '40%',
        height: 50,
    },
    loginText:{
        color: 'grey',
        fontSize: 20,
    },
    loginOptions:{
        width: '70%',
        alignItems: 'center',
        paddingTop: 10,
        marginBottom: 10,
    },
    loginOptionText:{
        fontSize: 20,
        color: 'white'
    },
    newUserContainer:{
        flexDirection:'row',
        alignItems: 'baseline'
    }
})

