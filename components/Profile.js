import React, { Component } from 'react'
import { View, Text, Button, Image, TouchableOpacity, StyleSheet, ScrollView, AsyncStorage, TouchableWithoutFeedback } from 'react-native';
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
import _ from 'lodash'

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

    _retrieveData = async (key) => {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                // We have data!!
                return value
            }
        } catch (error) {
            // Error retrieving data
            throw error;
        }
    };

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
        const token = await this._retrieveData('jwt')
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
                        Authorization: `Bearer ${token}`
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
        return _.reverse(this.filterPersonalReviews().map(review => (
           
            <View key={review.id} style={styles.indyReview}>
                <Text style={{color: 'grey', fontSize: 12}}>User: {review.user.username} says...</Text>
                <Text style={{color: 'grey', fontSize: 12}}>Hub: {review.hub.name}</Text>
                <Text style={{color: 'black', fontSize: 14}}>{review.content}</Text>
                <Text style={{color: 'grey', fontSize: 10}}>Date Posted: {review.created_at.split("T")[0]}</Text>
            </View>
        ))
        )
    }


    render() {
        return (
            <ScrollView contentContainerStyle={{alignItems:'center', height: 700}}>
                <View style={styles.avatarHolder}>
                    {this.props.user.avatar ? 
                    <View>
                        <Image source={{uri: this.props.user.avatar}} style={styles.avatar}/>
                        <TouchableOpacity 
                        style={styles.changeAvatarButton}
                        onPress={this.takeImage}
                        >

                            <Ionicons name="md-camera" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                    :
                    <TouchableOpacity 
                        style={styles.addAvatarButton}
                        onPress={this.takeImage}
                    >
                        <Text style={{color:'white'}}>Click to Add an avatar!</Text>
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
                
                <View style={styles.personalRevHolder}>
                    <Text>{this.props.user.username}'s Reviews:</Text>
                    <View style={styles.reviewsHolder}>
                        <TouchableWithoutFeedback>

                            <ScrollView contentContainerStyle={styles.reviewScroll}>
                                {this.renderPersonalReviews()}
                            </ScrollView>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                
                <TouchableOpacity
                    style={styles.logOut}
                    onPress={this.props.handleLogOut}
                >
                    <Text style={{color: 'white'}}>
                        Log Out
                    </Text>
                </TouchableOpacity> 
            </ScrollView>
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
        width: 40,
        height: 30,
        backgroundColor: Colors.loginScreenColor,
        borderRadius: 100,
        borderColor:'white',
        borderWidth: 1,
        justifyContent:'center',
        position: 'absolute',
        right: 10,
        top: 5,
        alignItems:'center'
    },
    avatar:{
        borderRadius: 100,
        borderWidth: 2,
        borderColor: 'white',
        height: 200,
        width: 200
    },
    avatarHolder:{
        marginTop:20,
        alignItems:'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4
    },
    usernameHolder:{
        alignItems:'center',
        backgroundColor:'whitesmoke',
        width: '90%',
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4
    },
    indyReview:{
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        width: '100%',
        alignItems: 'flex-start',
        padding: 10
    },
    reviewsHolder:{
        height: 250,
        width: '100%',
        alignItems:'center',
    },
    reviewScroll:{
        width: 300,
        alignItems:'center'
    },
    bioHolder:{
        width: '90%',
        paddingBottom: 20,
        
    },
    personalRevHolder:{
        backgroundColor:'whitesmoke',
        borderRadius: 10,
        width: '90%',
        padding: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4
    },
    logOut:{
        backgroundColor: '#1675AA',
        width: "90%",
        height: 40,
        borderRadius: 4,
        justifyContent:"center",
        alignItems: 'center',
        color:'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4
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