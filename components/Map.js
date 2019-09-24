import React, { Component } from 'react'
import { Text, Image, Alert, Button } from 'react-native'
import MapView, { Marker, Callout } from 'react-native-maps';

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';



export default class Map extends Component {
    constructor(props){
        super(props)
        
        
    }
  
    render() {
        console.log(this.props.navigation)
        return (
            <MapView 
            style={{flex: 1}}
            initialRegion={initialCoords}
            >
                {this.props.hubs.map(marker => (
                    <Marker
                        coordinate={{latitude: Number(marker.latitude), longitude: Number(marker.longitude)}}
                        title={marker.name}
                        description={marker.description}
                        key={marker.id}
                    >
                        <Callout onPress={() => 
                        this.props.navigation.navigate('HubShow',{
                        id: marker.id,})}>
                            <Text>{marker.name}</Text>
                            <Text>{marker.description}</Text>
                            <Text>{this.props.renderStars(marker.rating)}</Text>
                            <Button title="View More" />
                                
                        </Callout>
                    </Marker>
                ))
                }
                {this.props.renderLocation()}
                
            </MapView>
        )
    }
}

const initialCoords = {
    latitude: 41.8781,
    longitude: -87.6298,
    latitudeDelta: 0.0022,
    longitudeDelta: 0.0821,
}

