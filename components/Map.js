import React, { Component } from 'react'
import { Text, Image, Alert, } from 'react-native'
import MapView, { Marker, Callout } from 'react-native-maps';

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';


export default class Map extends Component {
    constructor(props){
        super(props)
        this.state = {
            location: {
                lat:42.8781,
                lng:-86.6298
            },
            isFetching: false,
        }
        
    }

    verifyPermissions = async () => {
        const result = await Permissions.askAsync(Permissions.LOCATION);
        if(result.status !== 'granted'){
            Alert.alert(
                'Insufficient permissions!',
                'You need to grant location permissions to use this app.',
                [{text: 'okay'}]
            );
            return false;
        }
        return true;
    };

    getLocation = async () => {
        const hasPermission = await this.verifyPermissions()
        if(!hasPermission){
            return;
        }

        try{
            const location = await Location.getCurrentPositionAsync({timeout: 5000});
            console.log(location);
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

    renderLocation = () => {
        return !this.state.isFetching ? 
                    <Marker
                        coordinate={{latitude: this.state.location.lat, 
                        longitude: this.state.location.lng}}
                        title="Your Location"
                        pinColor='blue'
                     >
                         <Image source={require('../assets/images/blue_person.png')} style={{height: 20, width: 20 }} />
                     </Marker>
                     : null 
    }



    componentDidMount(){
       this.getLocation()
    }

    render() {
        console.log(this.state)
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
                {this.renderLocation()}
                
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

