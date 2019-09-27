import React from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import { Card } from 'react-native-elements'
import getDirections from 'react-native-google-maps-directions'
import { connect } from 'react-redux'


const HubCard = (props) => {

    const {id, name, rating, reviews, userLocation, hubLatitude, hubLongitude} = props
    
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

    const showImage = showFirstImage() ? showFirstImage() : {image_url: "https://support.hostgator.com/img/articles/weebly_image_sample.png"}

    return (
        
            <Card>
                <Image source={{uri: showImage.image_url}} style={{height: 100, width: 300}}/>
                <View style={styles.header}>
                    <Text style={styles.cardTitle}>
                        {name}
                    </Text>
                    <Text>
                        Rating: {props.renderStars(rating)}({reviews.length} reviews)
                    </Text>
                </View>

                <Button
                    title="View More"
                    
                    onPress={()=>{props.navigation.navigate('HubShow',{
                        id: id,
                    })}}
                />
                <Button
                    title="Get Directions"
                    
                    onPress={this.handleGetDirections}
                />
            </Card>
        
    )
}

const styles = StyleSheet.create({
    header:{
        alignItems:'center'
    },
    cardTitle:{
        fontSize: 15,
    },
})




const mapStateToProps = (state) => {
    return({
        images: state.images,
        hubs: state.hubs
    })
}

export default connect(mapStateToProps)(HubCard)