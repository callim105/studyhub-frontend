import React, { Component } from 'react'
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import { AsyncStorage } from 'react-native';

import Colors from '../constants/Colors'
import Constants from "expo-constants";
const { manifest } = Constants;
const loginUri = `http://${manifest.debuggerHost.split(':').shift()}:3000/login`;

import { addUser, fetchUser } from '../redux/actions/userActions';
import { connect } from 'react-redux';

import CreateUserModal from '../components/CreateUserModal';

class LoginScreen extends Component {
    constructor(){
        super()
        this.state = {
            username:'',
            password:'',
            modalVisible: false
        }
    }

    setModalVisible = (visible) => {
        this.setState({modalVisible: visible})
    }

    handleLogin = () => {
        this.fetchLogin()
        
    }

    _storeData = async (key, value) => {
        try {
          await AsyncStorage.setItem(key, value)
        } catch (error) {
          // Error saving data
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
           if(data.message){
               Alert.alert('Incorrect Username or Password!')
               return;
           }else{

            this._storeData('jwt', data.jwt)
            this.props.navigation.navigate('Main')
           }
        })
        .catch(err => console.log(err))
    }


    render() {
        return (
            <View style={styles.screen}>
                <CreateUserModal
                    _storeData = {this._storeData}
                    modalVisible={this.state.modalVisible} 
                    setModalVisible={this.setModalVisible}
                    navigation={this.props.navigation}
                    
                />


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
                        <TouchableOpacity
                            onPress={()=>{
                                this.setModalVisible(true)
                            }}
                        >
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
        fontSize: 15,
        color: 'white'
    },
    newUserContainer:{
        paddingTop: 10,
        width:'60%',
        flexDirection:'row',
        alignItems: 'center',
        justifyContent:'space-around'
    }
})

export default connect(null, { fetchUser })(LoginScreen)