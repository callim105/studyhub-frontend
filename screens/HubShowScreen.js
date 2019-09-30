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
//Redux
import { connect } from 'react-redux';
import { addImage } from '../redux/actions/imageActions';
import { fetchUser } from '../redux/actions/userActions';
//Cloudinary api
const cloudKey = "238271533983158"
const cloudName = 'callimx'



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
        return this.props.reviews.filter(review =>{
            return review.hub.id == this.id
        })
    }

    renderReviews = () => {
        return this.filterReviews().map(review => (
            <View key={review.id} style={styles.indyReview}>
                <Text style={{color: 'grey', fontSize: 15}}>User: {review.user.username} says...</Text>
                <Text>{review.content}</Text>
            </View>
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
                    <View>
                        <View style={{flexDirection:'row', justifyContent:'space-between', width: '95%'}}>
                            <Text style={styles.name}>{this.currentHub.name}</Text>
                            <TouchableOpacity
                                onPress={
                                    this.takeImage
                                }
                            >
                                <Text style={styles.addReviewText}>
                                Add Photo
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Text>Rating: {this.renderStars(this.calcRating())} ({this.filterReviews().length} Reviews)</Text>
                        <Text>Description:{this.currentHub.description}</Text>
                    </View>
                    <View style={styles.addReviewHolder}>
                        <TouchableOpacity
                            onPress={()=>{
                                this.setModalVisible(true)
                            }}
                        >
                            <Text style={styles.addReviewText}>
                            Add Review
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            onPress={
                                this.handleGetDirections
                            }
                        >
                            <Text style={styles.addReviewText}>
                            Get Directions
                            </Text>
                        </TouchableOpacity>
                    </View>
                    
                </View>
                <View style={styles.scrollViewHolder}>
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
        borderBottomWidth: 1,
        borderBottomColor: 'black'
    },
    addReviewText:{
        fontSize: 20,
        color: 'blue'
    },
    reviewsHolder:{
        alignItems: 'center',
        paddingVertical: 5
    },
    indyReview:{
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        width: '80%',
        alignItems: 'flex-start',
        padding: 10
    },
    scrollViewHolder:{
        height:350
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