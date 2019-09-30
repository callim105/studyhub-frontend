import React, { Component } from 'react'
import { View, Text, Button, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Colors from '../constants/Colors'
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { Ionicons } from '@expo/vector-icons';
const cloudName = 'callimx'
import Constants from "expo-constants";

const { manifest } = Constants;

import { connect } from 'react-redux';
import { addProfileToUser } from '../redux/actions/userActions';
import EditBioModal from '../components/EditBioModal';

class Profile extends Component {
    
    constructor(props){
        super(props)
        this.state = {
            modalVisible: false,
        }
        this.userUrl = `http://${manifest.debuggerHost.split(':').shift()}:3000/users/${this.props.user.id}`;
    }

    componentDidMount(){

    }

    setModalVisible = (visible) => {
        this.setState({modalVisible: visible})
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
    filterPersonalReviews = () => {
        return this.props.reviews.filter(review =>{
            return review.user.id == this.props.user.id
        })
    }
    
    renderPersonalReviews = () => {
        return this.filterPersonalReviews().map(review => (
           
            <View key={review.id} style={styles.indyReview}>
                <Text style={{color: 'grey', fontSize: 12}}>User: {review.user.username} says...</Text>
                <Text style={{color: 'grey', fontSize: 12}}>Hub: {review.hub.name}</Text>
                <Text style={{color: 'black', fontSize: 14}}>{review.content}</Text>
                <Text style={{color: 'grey', fontSize: 10}}>Date Posted: {review.created_at.split("T")[0]}</Text>
            </View>
        ))
    }


    render() {
        return (
            <View>
                <View style={styles.avatarHolder}>
                    {this.props.user.avatar ? 
                    <View>
                        <Image source={{uri: this.props.user.avatar}} style={styles.avatar}/>
                        <TouchableOpacity 
                        style={styles.changeAvatarButton}
                        onPress={this.takeImage}
                        >

                            <Ionicons name="md-create" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                    :
                    <TouchableOpacity 
                        style={styles.addAvatarButton}
                        onPress={this.takeImage}
                    >
                        <Text>Add an avatar!</Text>
                    </TouchableOpacity>
                    }
                </View>
                <View style={styles.usernameHolder}>
                    <Text style={{fontSize: 30,}}>{this.props.user.username}</Text>
                    <View style={styles.bioHolder}>
                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                            <Text>Bio:</Text>
                            <TouchableOpacity
                                style={{flexDirection:'row'}}
                                onPress={() => this.setModalVisible(!this.state.modalVisible)}
                            >
                                <Text style={{color:Colors.loginScreenColor}}>Edit</Text>
                                <Ionicons name="md-create" size={20} color={Colors.loginScreenColor} />
                            </TouchableOpacity>
                        </View>
                        <Text>
                            {this.props.user.bio}
                        </Text>
                    </View>

                    <EditBioModal  
                        setModalVisible={this.setModalVisible} 
                        modalVisible={this.state.modalVisible}
                    />
                </View>
                <View
                style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 1,
                }}
                />
                <Text>{this.props.user.username}'s Reviews:</Text>
                <View style={styles.reviewsHolder}>
                    <ScrollView contentContainerStyle={styles.reviewScroll}>
                        {this.renderPersonalReviews()}
                    </ScrollView>

                </View>
                
                <Button title="Log Out" onPress={this.props.handleLogOut} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    addAvatarButton:{
        width: 100,
        padding:10,
        backgroundColor: Colors.loginScreenColor,
    },
    changeAvatarButton:{
        width: 50,
        backgroundColor: Colors.loginScreenColor,
        borderRadius: 100,
        borderColor:'black',
        borderWidth: 1,
        position: 'absolute',
        right: 10,
        top: 5,
        alignItems:'center'
    },
    avatar:{
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'black',
        height: 200,
        width: 200
    },
    avatarHolder:{
        marginTop:20,
        alignItems:'center'
    },
    usernameHolder:{
        alignItems:'center'
    },
    indyReview:{
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        width: '100%',
        alignItems: 'flex-start',
        padding: 10
    },
    reviewsHolder:{
        height: 300,
        width: '100%',
        alignItems:'center',
    },
    reviewScroll:{
        width: 300,
        alignItems:'center'
    },
    bioHolder:{
        width: 250,
        paddingBottom: 20,
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