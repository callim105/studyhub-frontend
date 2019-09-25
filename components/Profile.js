import React, { Component } from 'react'
import { View, Text, Button, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../constants/Colors'
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

const cloudName = 'callimx'
import Constants from "expo-constants";

const { manifest } = Constants;

import { connect } from 'react-redux';
import { addProfileToUser } from '../redux/actions/userActions';


class Profile extends Component {
    
    constructor(props){
        super(props)
        this.state = {
            image: "",
        }
        this.userUrl = `http://${manifest.debuggerHost.split(':').shift()}:3000/users/${this.props.user.id}`;
    }

    componentDidMount(){

    }

    

    verifyPermissions = async () => {
        const result = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
        if(result.status !== 'granted'){
            Alert.alert(
                'Insufficient permissions!',
                'You need to grant camera permissions to use this part.',
                [{text: 'Okay'}]
            );
            return false;
        }
        return true
    }

    takeImage = async () => {
        const hasPermission = await this.verifyPermissions();
        if(!hasPermission){
            return;
        }
        const image = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [16, 9],
            base64: true
        });
        if(!image.cancelled){
            this.setState({takenImage: image.uri})
            let base64Img = `data:image/jpg;base64,${image.base64}`

        
            let apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
            let data = {
                "file": base64Img,
                "upload_preset": "baperfir",
            }
            fetch(apiUrl, {
                body: JSON.stringify(data),
                headers: {
                'content-type': 'application/json'
                },
                method: 'POST',
            }).then(async r => {
                let data = await r.json()
                
                let photoUrl = data.secure_url
                
                fetch(this.userUrl,{
                    method: 'PATCH',
                    headers: {
                        "Content-Type": "application/json",
                        "Accepts": "application/json",
                    },
                    body: JSON.stringify({
                        avatar: photoUrl
                    })
                })
                .then(res => res.json())
                .then(updatedUser => this.props.addProfileToUser(updatedUser))
            }).catch(err=>console.log(err))
        }
    }



    render() {
       console.log("PROFILE", this.props.user)
        return (
            <View>
                <View>
                    {this.props.user.avatar ? 
                    <Image source={{uri: this.props.user.avatar}} style={{width: 300, height: 300}}/>
                    :
                    <TouchableOpacity 
                        style={styles.addAvatarButton}
                        onPress={this.takeImage}
                    >
                        <Text>Add an avatar!</Text>
                    </TouchableOpacity>
                    }
                </View>
                <Text>{this.props.user.username}</Text>

                <TouchableOpacity 
                        style={styles.addAvatarButton}
                        onPress={this.takeImage}
                >
                        <Text>Change avatar!</Text>
                </TouchableOpacity>
                
                <Button title="Log Out" onPress={this.props.handleLogOut} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    addAvatarButton:{
        padding:10,
        backgroundColor: Colors.loginScreenColor,
        borderRadius:5
    }
})

const mapStateToProps = state => {
    return ({
        user: state.user,
        hubs: state.hubs,
        reviews: state.reviews,
        images: state.images
    })
}

export default connect(mapStateToProps, { addProfileToUser })(Profile);