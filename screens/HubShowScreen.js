import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert} from 'react-native'
import AddReviewModal from '../components/AddReviewModal'
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Constants from "expo-constants";
const { manifest } = Constants;
const railsImageUri = `http://${manifest.debuggerHost.split(':').shift()}:3000/images`;
import { SliderBox } from 'react-native-image-slider-box';
import getDirections from 'react-native-google-maps-directions'
import Review from '../components/Review';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';


//Redux
import { connect } from 'react-redux';
import { addImage } from '../redux/actions/imageActions';
import { fetchUser } from '../redux/actions/userActions';
//Cloudinary api

const cloudName = 'callimx'
import _ from 'lodash'


class HubShowScreen extends Component {
    constructor(props){
        super(props)
        this.state={
            isFetching: false,
            modalVisible: false,
            takenImage: null,
            images: [],
            imageUrls: [],
            currentUser: {},
            location:{}
        }
        this.id = this.props.navigation.getParam('id', 'noId')
        this.currentHub = this.getThisHub()
    }

    async componentDidMount(){
        this.props.fetchUser()
        this.getLocation()
        this.filterHubImages()
        this.setState({currentUser: this.props.user})
    }

    getLocation = async () => {
        const hasPermission = await this.verifyPermissions()
        if(!hasPermission){
            return;
        }

        try{
            const location = await Location.getCurrentPositionAsync({timeout: 5000});
            this.setState({
                isFetching: true,
                location:{
                lat: location.coords.latitude,
                lng: location.coords.longitude
            }});
        } catch(err){
            Alert.alert('Could not fetch location',)
        }
        this.setState({isFetching: false})
    }

    filterHubImages = () => {
        const hubImages = this.props.images.filter(image => {
            return image.hub_id == this.id
        })
        const imageUrls = []
        hubImages.forEach(image => imageUrls.push(image.image_url))
        this.setState({images: hubImages, imageUrls: imageUrls})

    }
   

    getThisHub = () => {
        const currentHub = (this.props.hubs.filter(hub =>{
            return hub.id == this.id
        })[0])
        return currentHub
    }

    renderStars = (rating) => {
        if(rating){
            let numRating = Number(rating)
            let stars = []
            for(let i = 0; i < numRating; i++ ){
                stars.push('⭐')
            }
            return (stars.join(''))
        } else {
            return "No Reviews"
        }
    }

    //Calculates Rating
    calcRating = () => {
        const ratings = []
        let reviews = this.filterReviews()
        reviews.forEach(review => ratings.push(review.rating))
        let count = ratings.length;
        if(count > 0){
            let values = ratings.reduce((previous, current) => current += previous);
            return(Math.floor(values /= count));
        } else {
            return null
        }
    }

    filterReviews = () => {
        return _.reverse(this.props.reviews.filter(review =>{
            return review.hub.id == this.id
        }))
    }

    renderReviews = () => {
        return this.filterReviews().map(review => (
            <Review review={review} key={review.id} renderStars={this.renderStars}/>
        ))
    }

    setModalVisible = (visible) => {
        this.setState({modalVisible: visible})
    }

    //Handle Images
    verifyPermissions = async () => {
        const result = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL, Permissions.LOCATION);
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
                fetch(railsImageUri,{
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "Accepts": "application/json",
                    },
                    body: JSON.stringify({
                        image: {
                            hub_id: this.id,
                            user_id: this.state.currentUser.id,
                            image_url: photoUrl
                        }
                    })
                })
                .then(res => res.json())
                .then(image => {
                    this.props.addImage(image)
                    this.filterHubImages()
                })
            }).catch(err=>console.log(err))
        }
    }

    pickImage = async () => {
        const hasPermission = await this.verifyPermissions();
        if(!hasPermission){
            return;
        }
        const image = await ImagePicker.launchImageLibraryAsync({
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
                fetch(railsImageUri,{
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "Accepts": "application/json",
                    },
                    body: JSON.stringify({
                        image: {
                            hub_id: this.id,
                            user_id: this.state.currentUser.id,
                            image_url: photoUrl
                        }
                    })
                })
                .then(res => res.json())
                .then(image => {
                    this.props.addImage(image)
                    this.filterHubImages()
                })
            }).catch(err=>console.log(err))
        }
    }

    //Directions
    handleGetDirections = () => {
        const data = {
            source: {
                latitude: Number(this.state.location.lat),
                longitude: Number(this.state.location.lng)
            },
            destination:{
                latitude: Number(this.currentHub.latitude),
                longitude: Number(this.currentHub.longitude)
            },
            params:[
                {
                  key: "travelmode",
                  value: "driving"        // may be "walking", "bicycling" or "transit" as well
                },
                {
                  key: "dir_action",
                  value: "navigate"       // this instantly initializes navigation using the given travel mode
                }
            ]
        }
        getDirections(data)
    }

    //Handle Edit and Delete Hub

    

    render() {
        
        return (
            <View styles={styles.screen}>
                
                <AddReviewModal 
                    modalVisible={this.state.modalVisible} 
                    setModalVisible={this.setModalVisible}
                    hubId={this.id}
                    renderStars={this.renderStars}
                />

                <View styles={styles.imageContainer}>
                    {this.state.images.length > 0 ? 
                        <SliderBox images={this.state.imageUrls} />
                        :
                        <Image source={require('../assets/images/Study_Hub.png')} style={{height:300, width:'100%'}}/>
                    }
                </View>
                <View>
                    <View style={{paddingLeft: 10}}>
                        <View style={{flexDirection:'row', justifyContent:'space-between', width: '95%'}}>
                            <Text style={styles.name}>{this.currentHub.name}</Text>
                        </View>
                            
                        <Text style={{fontSize: 20}}>Rating: {this.renderStars(this.calcRating())} {this.filterReviews().length} Reviews</Text>
                        <Text>{this.currentHub.description}</Text>
                    </View>
                    <View style={{
                    flexDirection: 'row',
                    justifyContent:'space-around',
                    paddingTop: 5,
                    paddingBottom: 5}}>
                            <TouchableOpacity
                                style={styles.hubOptions}
                                onPress={
                                    this.takeImage
                                }
                            >
                                <Ionicons name="md-camera" size={20} color="white" />
                                <Text style={{color:'white', fontSize: 20}}>Take Photo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.hubOptions}
                                onPress={
                                    this.pickImage
                                }
                            >
                                <MaterialCommunityIcons name="camera-iris" size={20} color="white" />
                                <View>
                                <Text style={{color:'white', fontSize: 11}}>Add Photo</Text>
                                <Text style={{color:'white', fontSize: 11}}>from Camera Roll</Text>
                                </View>
                            </TouchableOpacity>
                    </View>
                    <View style={styles.addReviewHolder}>
                        <TouchableOpacity
                            style={styles.hubOptions}
                            onPress={()=>{
                                this.setModalVisible(true)
                            }}
                        >
                            <MaterialCommunityIcons name="comment" size={20} color="white" />
                            <Text style={{color:'white', fontSize: 20}}>Add Review</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={styles.hubOptions}
                            onPress={
                                this.handleGetDirections
                            }
                        >
                            <MaterialIcons name="directions" size={20} color="white" />
                            <Text style={{color:'white', fontSize: 20}}>Directions</Text>
                        </TouchableOpacity>
                    </View>
                    
                    
                </View>
                <View style={styles.scrollViewHolder}>
                    <View style={{borderBottomColor:'black', borderBottomWidth:2, paddingLeft: 10,}}>
                        <Text>Reviews:</Text>

                    </View>
                    <ScrollView contentContainerStyle={styles.reviewsHolder}>
                        {this.renderReviews()}
                    </ScrollView>
                </View>
            </View>
        )
    }
}

HubShowScreen.navigationOptions = {
    headerStyle: {
        backgroundColor: '#1675AA',
    },
    headerRight: (<Image source={require("../assets/images/study_logo.png")} style={{height: 40, width: 40}}/>),
    headerBackTitleStyle:{
        color:'white'
    }
};

const styles = StyleSheet.create({
    name: {
        fontSize: 30,
    },
    imageContainer:{
        flex: 1,
        width:'100%'
    },
    reviewModal:{
        alignItems: 'center',
    },
    addReviewHolder:{
        flexDirection: 'row',
        justifyContent:'space-around',
        paddingTop: 5,
        paddingBottom: 5
    },
    addReviewText:{
        fontSize: 20,
        color: 'blue'
    },
    reviewsHolder:{
        alignItems: 'center',
        paddingVertical: 5,
        backgroundColor:'#e9ebee'
    },
    indyReview:{
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        width: '80%',
        alignItems: 'flex-start',
        padding: 10
    },
    scrollViewHolder:{
        height:350,
        paddingBottom: 90,
        
    },
    photoOptions:{
        fontSize: 15,
        color: 'blue'
    },
    hubOptions:{
        backgroundColor: '#1675AA',
        flexDirection:'row',
        borderRadius: 20,
        padding: 5,
        justifyContent:'space-around',
        width: 150,
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

const mapStateToProps = (state) => {
    return ({
        user: state.user,
        hubs: state.hubs,
        reviews: state.reviews,
        images: state.images
    })
}

export default connect(mapStateToProps, { fetchUser, addImage })(HubShowScreen)