import React, { Component } from 'react'
import {
    View, 
    Text, 
    Modal, 
    TouchableOpacity, 
    Alert, 
    StyleSheet, 
    AsyncStorage,
    TextInput,
    Picker
} from 'react-native'

import Constants from "expo-constants";
const { manifest } = Constants;

const createUserUri = `http://${manifest.debuggerHost.split(':').shift()}:3000/users`;
const loginUri = `http://${manifest.debuggerHost.split(':').shift()}:3000/login`
import { connect } from 'react-redux';
const COLORS = {
    appBlue: '#1675AA',
}


class CreateUser extends Component {
    constructor(props){
        super(props)
        this.state = {
            username:"",
            password:"",
            confirmPassword:"",
        }
        
    }

    handleSubmit = () => {
        const { password, confirmPassword } = this.state;
        // perform all neccassary validations
        if (password !== confirmPassword) {
            alert("Passwords don't match");
        } else {
            // make API call
            this.createUser()
        }
    }

    _storeData = async (key, value) => {
        try {
          await AsyncStorage.setItem(key, value)
        } catch (error) {
          // Error saving data
        }
    };

    createUser = () => {
        return fetch(createUserUri, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                user:{
                    username: this.state.username,
                    password: this.state.password
                }
            })
        })
            .then(res => res.json())
            .then(user => this.loginNewUser())
            .catch(err => console.error(err))
    }

    loginNewUser = () => {
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
            console.log(data)
           this._storeData('jwt', data.jwt)
          
        })
        .then(() => {
            this.props.navigation.navigate('Main')
        })
        .catch(err => console.log(err))
    }

    render() {
        return (
            <View>
                <Modal
                animationType="slide"
                transparent={false}
                visible={this.props.modalVisible}
                onRequestClose={() => {
                 Alert.alert('Modal has been closed.');
                }}>
                    <View style={styles.header}>
                            <Text style={{color: 'white', fontSize: 30}}>Create an Account</Text>
                            
                    </View>
                    <View style={{marginTop: 50}}>
                        <View style={styles.createUserModal}>
                            <View style={styles.formHolder}>
                                <View style={styles.formLabel}>
                                    <Text>Username</Text>
                                    <TextInput 
                                        style={styles.formTextInput} 
                                        placeholder="Enter Username..." 
                                        onChangeText={username => this.setState({username: username})}
                                        value={this.state.username}
                                    />
                                    <Text>Password</Text>
                                    <TextInput 
                                        style={styles.formTextInput} 
                                        placeholder="Enter password..." 
                                        onChangeText={password => this.setState({password: password})}
                                        value={this.state.password}
                                        secureTextEntry
                                    />
                                    <Text>Confirm Password</Text>
                                    <TextInput 
                                        style={styles.formTextInput} 
                                        placeholder="Confirm password..." 
                                        onChangeText={password => this.setState({confirmPassword: password})}
                                        value={this.state.confirmPassword}
                                        secureTextEntry
                                    />
                                </View>
                            <TouchableOpacity
                                onPress={() => {
                                    this.handleSubmit()
                                }}
                                style={styles.createButton}
                            >
                                <Text style={{color:"white", fontSize: 20}}>
                                    Create User
                                </Text>
                            </TouchableOpacity>
                        </View>
                        
                        
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => {
                            this.props.setModalVisible(!this.props.modalVisible);
                            }}>
                                    <Text>Back</Text>
                        </TouchableOpacity>
                        
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    createUserModal:{
        alignItems: 'center',
        justifyContent:'center'
    },
    header:{
        paddingTop: 40,
        width: '100%',
        backgroundColor: COLORS.appBlue,
        height: 80,
        alignItems:'center'
    },
    formHolder:{
        width: '80%',
        alignItems: 'center',
        justifyContent:'center',
    },
    formTextInput:{
        width:"100%",
        height: 56,
        borderRadius: 4,
        position: 'relative',
        backgroundColor: "lightgrey",
        marginBottom: 20
    },
    createButton:{
        backgroundColor: COLORS.appBlue,
        width: "100%",
        height: 40,
        borderRadius: 4,
        justifyContent:"center",
        alignItems: 'center'
    },
    formLabel:{
        alignItems: 'flex-start',
        width: "100%"
    },
    backButton:{
        paddingTop: 30,
    }
})



export default connect()(CreateUser);