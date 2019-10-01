import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Card } from 'react-native-elements'
import getDirections from 'react-native-google-maps-directions'
import { connect } from 'react-redux'


const HubCard = (props) => {

    const {id, name, rating, reviews, userLocation, hubLatitude, hubLongitude, distance} = props
    
    handleGetDirections = () => {
        const data = {
            source: {
                latitude: Number(userLocation.lat),
                longitude: Number(userLocation.lng)
            },
            destination:{
                latitude: Number(hubLatitude),
                longitude: Number(hubLongitude)
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

    showFirstImage = () => {
        const image = props.images.filter(image => id == image.hub_id)[0]
        return image
    }

    function round(value, decimals) {
        return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    }

    distanceMeters = (distance) => {
        if(Number(distance * 100000) < 1000){
            return <Text>{round(distance * 100000, 3)} m away</Text>
        } else{
            return <Text>{round(distance, 3)} km away</Text>
        }
    }

    const showImage = showFirstImage() ? showFirstImage() : {image_url: "https://support.hostgator.com/img/articles/weebly_image_sample.png"}
    
    return (
        
            <Card
                image={{uri: showImage.image_url}}
                imageWrapperStyle={{borderRadius: 20, overflow: 'hidden'}}
                containerStyle={{borderRadius: 20}}
            >
                <View style={styles.header}>
                    <Text style={styles.cardTitle}>
                        {name}
                    </Text>
                    <Text>
                        Rating: {props.renderStars(rating)}({reviews.length} reviews)
                    </Text>
                    <Text>{distanceMeters(distance)}</Text>
                </View>
                <View style={styles.options}>
                    <TouchableOpacity 
                        style={styles.viewMoreButton}
                        onPress={()=>{props.navigation.navigate('HubShow',{
                            id: id,
                        })}}
                    >
                        <Text style={{color:'#1675AA', fontSize: 20}}>View More</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.getDirectionsButton}
                        onPress={this.handleGetDirections}
                    >
                        <Text style={{color:'#1675AA', fontSize: 20}}>Get Directions</Text>
                    </TouchableOpacity>
                </View>
            </Card>
        
    )
}

const styles = StyleSheet.create({
    header:{
        alignItems:'flex-start'
    },
    cardTitle:{
        fontSize: 25,
    },
    cardImage:{
        width: '100%',
        height: 100
    },
    viewMoreButton:{
       
    },
    getDirectionsButton:{
        
        
    },
    options:{
        flexDirection:'row',
        justifyContent:'space-around',
        paddingTop: 10
    }
})




const mapStateToProps = (state) => {
    return({
        images: state.images,
        hubs: state.hubs
    })
}

export default connect(mapStateToProps)(HubCard)