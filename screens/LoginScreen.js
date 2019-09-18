import React, { Component } from 'react'
import { View, Text, StyleSheet, TextInput, Image, Button } from 'react-native';
import Colors from '../constants/Colors'

export default class LoginScreen extends Component {
    constructor(){
        super()
        this.state = {
            username:'',
            password:''
        }
    }



    render() {
        return (
            <View style={styles.screen}>
                <Image style={styles.logo}source={require('../assets/images/Study_Hub.png')} />
        
                <View style={styles.formInputHolder}>
                    <TextInput 
                        style={styles.usernameForm}
                        placeholder="Enter Username"
                        onChangeText={text => this.setState({username: text})}
                        value={this.state.username}
                    />
                </View>
                <View style={styles.formInputHolder}>
                    <TextInput 
                        style={styles.usernameForm}
                        placeholder="Enter Password"
                        onChangeText={text => this.setState({password: text})}
                        value={this.state.password}
                        secureTextEntry
                    />
                </View>
                
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    screen:{
        flex: 1,
        backgroundColor: Colors.loginScreenColor,
        alignItems: 'center',
        paddingVertical: 50,
        justifyContent: 'center'
    },
    logo:{
        width: 300,
        height: 300,
        
    },
    usernameForm:{
        height: 40,
        width: '50%',
        backgroundColor: 'white',
    },
    formInputHolder:{
        flexDirection: 'row',
        paddingBottom: 10,
    },
    
})