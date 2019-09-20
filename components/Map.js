import React, { Component } from 'react'
import { Text, Image, } from 'react-native'
import MapView, { Marker, Callout } from 'react-native-maps';


export default class Map extends Component {
    constructor(props){
        super(props)
    }

    render() {
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
                        <Callout
                        onPress={() => console.log("fix?")}
                        >
                            <Text>{marker.name}</Text>
                            <Text>{marker.description}</Text>
                            <Text>{this.props.renderStars(marker.rating)}</Text>
                            <Image 
                            style={{width: 50, height: 50}}
                            source={{uri: 'https://facebook.github.io/react-native/img/tiny_logo.png'}}
                            />
                        </Callout>
                    </Marker>
                ))

                }
            </MapView>
        )
    }
}

const initialCoords = {
    latitude: 41.8781,
    longitude: -87.6298,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
}

