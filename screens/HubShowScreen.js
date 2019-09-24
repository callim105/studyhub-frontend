import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert} from 'react-native'
import AddReviewModal from '../components/AddReviewModal'
import { connect } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Constants from "expo-constants";
const { manifest } = Constants;
const railsImageUri = `http://${manifest.debuggerHost.split(':').shift()}:3000/images`;
import { SliderBox } from 'react-native-image-slider-box';


//Cloudinary api
const cloudKey = "238271533983158"
const cloudName = 'callimx'



class HubShowScreen extends Component {
    constructor(props){
        super(props)
        this.state={
            modalVisible: false,
            takenImage: null,
            images: [],
            imageUrls: []
        }
        this.id = this.props.navigation.getParam('id', 'noId')
    }

    componentDidMount(){
        this.filterHubImages()
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
                console.log(data.secure_url)
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
                            user_id: this.props.user.id,
                            image_url: photoUrl
                        }
                    })
                })
                .then(res => res.json())
                .then(console.log)
            }).catch(err=>console.log(err))
        }
    }

    render() {
        const currentHub = this.getThisHub()
        console.log(this.state.images)
        return (
            <View styles={styles.screen}>
                
                <AddReviewModal 
                    modalVisible={this.state.modalVisible} 
                    setModalVisible={this.setModalVisible}
                    hubId={this.id}
                />

                <View styles={styles.imageContainer}>
                    {this.state.images.length > 0 ? 
                        <SliderBox images={this.state.imageUrls} />
                        // <Image 
                        // source={{uri:this.state.images[0].image_url}}
                        // style={{height: 300, width: '100%'}}
                        // />
                        :
                        // <Image source={{uri: this.state.takenImage}} style={{height:300, width:'100%'}}/>
                        <Image source={require('../assets/images/Study_Hub.png')} style={{height:300, width:'100%'}}/>
                    }
                </View>
                <View>
                    <Text style={styles.name}>{currentHub.name}</Text>
                    <Text>Rating: {this.renderStars(this.calcRating())} ({this.filterReviews().length} Reviews)</Text>
                    <Text>Description:{currentHub.description}</Text>
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
                                this.takeImage
                            }
                        >
                            <Text style={styles.addReviewText}>
                            Add Photo
                            </Text>
                        </TouchableOpacity>
                    </View>
                    
                </View>
                
                <ScrollView contentContainerStyle={styles.reviewsHolder}>
                    
                    {this.renderReviews()}
                </ScrollView>

            </View>
        )
    }
}

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
        justifyContent:'space-between',
        borderBottomWidth: 1,
        borderBottomColor: 'black'
    },
    addReviewText:{
        fontSize: 20,
        color: 'blue'
    },
    reviewsHolder:{
        alignItems: 'center'
        
    },
    indyReview:{
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        width: '80%',
        alignItems: 'flex-start',
        padding: 10
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

export default connect(mapStateToProps)(HubShowScreen)