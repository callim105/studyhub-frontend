import React, { Component } from 'react'
import { Text, Image, Alert, Button, View } from 'react-native'
import MapView, { Marker, Callout } from 'react-native-maps';

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
//Redux
import { connect } from 'react-redux'


class Map extends Component {
    constructor(props){
        super(props)        
        
    }

    calloutPic = (hubId) => {
        
        const image = this.props.images.filter(image => {
                return hubId == image.hub_id
                }
            )[0]
        return image
    }
    
    renderMarkers = () => {
        return this.props.hubs.map(hub => {   
            const image = this.calloutPic(hub.id) ? this.calloutPic(hub.id) : {image_url: "https://support.hostgator.com/img/articles/weebly_image_sample.png"}
            
            return (<Marker
                coordinate={{latitude: Number(hub.latitude), longitude: Number(hub.longitude)}}
                title={hub.name}
                description={hub.description}
                key={hub.id}
            >
                <Callout onPress={() => 
                this.props.navigation.navigate('HubShow',{
                id: hub.id,})}>
                    <Text>{hub.name}</Text>
                    <Text>{hub.description}</Text>
                    <Text>{hub.id}</Text>
                    <Image source={{uri: image.image_url}} style={{width: 200, height: 150}}/>

                    <Text>{this.props.renderStars(hub.rating)}</Text>
                    <Button title="View More" />
                        
                </Callout>
            </Marker>)
        })
    }

    renderMap = () => {
        if(Number(this.props.userLocation.lat) !== 42.8781){
                return (
                    <MapView 
                    style={{flex: 1}}
                    initialRegion={{
                        latitude: this.props.userLocation.lat,
                        longitude: this.props.userLocation.lng,
                        latitudeDelta: 0.04,
                        longitudeDelta: 0.04,}}
                    >
                        {this.renderMarkers()}
                        {this.props.renderLocation()}
                    </MapView>
                )
                } else {
                return (
                    <MapView 
                    style={{flex: 1}}
                    initialRegion={initialCoords}
                    >
                        {this.renderMarkers()}
                        {this.props.renderLocation()}
                    </MapView>
                )
            }
    }

    render() {
        
        return(
            <MapView 
            style={{flex: 1}}
            region={{
                latitude: this.props.userLocation.lat,
                longitude: this.props.userLocation.lng,
                latitudeDelta: 0.04,
                longitudeDelta: 0.04,}}
            >
                {this.renderMarkers()}
                {this.props.renderLocation()}
            </MapView>
        )
    }
}

const initialCoords = {
    latitude: 40,
    longitude: -87.6276310,
    latitudeDelta: 0.0022,
    longitudeDelta: 0.0821,
}


const mapStateToProps = state => {
    return({
        hubs: state.hubs,
        reviews: state.reviews,
        images: state.images
    })
}
export default connect(mapStateToProps)(Map)
