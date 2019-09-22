import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Button, AsyncStorage } from 'react-native';

import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import NoiseRadioButtons from '../components/NoiseRadioButtons'
//Import location component
//URL for fetch post
//Importan updates? not really... delete this comment later
import Constants from "expo-constants";
const { manifest } = Constants;
const uri = `http://${manifest.debuggerHost.split(':').shift()}:3000/hubs`;


export default class AddHubScreen extends Component{
    constructor(){
        super()
        this.state = {
            location: {
                lat:41.8915382173781,
                lng:-87.62763102647939
            },
            addLocation:{
                lat: 41.8915382173781,
                lng: -87.62763102647939
            },
            hubName: '',
            hubWifi: false,
            hubDescription: '',
            hubRestrooms: false,
            hubNoise: null,
        };
    }

    handleHubSubmit = () => {
        fetch(uri, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accepts": "application/json",
            },
            body: JSON.stringify({
                hub: {
                    name: this.state.hubName,
                    latitude: this.state.addLocation.lat,
                    longitude: this.state.addLocation.lng,
                    wifi: this.state.hubWifi,
                    restrooms: this.state.hubRestrooms,
                    noise: this.state.hubNoise
                }
            })
        })
        .then(res => res.json())
        .then(console.log)
    }
//NEED TO REDUX THIS NOW BEFORE MOVING ON.

    addHubLocation = (e) => {
        this.setState({
            addLocation:{
                lat: e.nativeEvent.coordinate.latitude,
                lng: e.nativeEvent.coordinate.longitude
            }
        })
        console.log(e.nativeEvent.coordinate)
    }

    setNoiseLevel = (level) => {
        this.setState({hubNoise: level})
    }

    render(){
        console.log(this.state)
            return(
                <View style={styles.container}>
                    <MapView
                        style={{ flex: 1 }}
                        initialRegion={initialCoords}
                    >
                        <Marker
                        coordinate={{latitude: this.state.location.lat, 
                        longitude: this.state.location.lng}}
                        title="Place on Hub"
                        draggable
                        onDragEnd={this.addHubLocation}
                        >

                        </Marker>
                    </MapView>
                    <ScrollView style={styles.addFormContainer}>
                            <Text>Add a New Hub!</Text>
                            <View>
                                <Text>Name: </Text>
                                <TextInput 
                                    style={styles.formInput} 
                                    onChangeText={name => this.setState({hubName: name})}
                                    value={this.state.hubName}
                                
                                />
                                <Text>Description: (Add a short description of the hub!)</Text>
                                <TextInput 
                                    style={styles.description} 
                                    multiline={true}
                                    autoCapitalize="sentences"
                                />

                                <Text>Latitude:{this.state.addLocation.lat}</Text>
                                <Text>Longitude:{this.state.addLocation.lng}</Text>


                                <Text>Wifi: </Text>
                                <TouchableOpacity
                                style={styles.circle}
                                onPress={() => {
                                    this.setState((prevState) => ({
                                        hubWifi: !prevState.hubWifi,
                                    }));
                                }}
                                >
                                {this.state.hubWifi && <View style={styles.checkedCircle} />}
                                </TouchableOpacity>
                                

                                <Text>Restrooms</Text>
                                <TouchableOpacity
                                style={styles.circle}
                                onPress={() => {
                                    this.setState((prevState) => ({
                                       hubRestrooms: !prevState.hubRestrooms,
                                    }));
                                }}
                                >
                                {this.state.hubRestrooms && <View style={styles.checkedCircle} />}
                                </TouchableOpacity>

                                <Text>Noise Level</Text>
                                <NoiseRadioButtons options={options} setNoiseLevel={this.setNoiseLevel}/>

                                <Button title="Submit Hub" onPress={this.handleHubSubmit}/>
                                
                            </View>
                    </ScrollView>

                </View> 
            )
        }
    
}

const initialCoords = {
    latitude: 41.8781,
    longitude: -87.6298,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
}

//Implement Noise Level Radio Buttons
const options = [
    {
        key:"Low",
        text: "Low"
    },
    {
        key: "Average",
        text: "Average"
    },
    {
        key: "Loud",
        text: "Loud"
    }
]


AddHubScreen.navigationOptions = {
    title: 'Add A Hub',
    headerStyle: {
        backgroundColor: '#1675AA',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
        fontWeight: 'bold',
    },
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    addFormContainer:{
        height: 200,
    },
    formInput:{
        width: "80%",
        height: 30,
        borderWidth: 1,
        borderColor: 'black'
    },
    circle: {
		height: 20,
		width: 20,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#ACACAC',
		alignItems: 'center',
		justifyContent: 'center',
	},
	checkedCircle: {
		width: 14,
		height: 14,
		borderRadius: 7,
		backgroundColor: '#794F9B',
    },
    description:{
        height: 70,
        borderWidth: 1,
        borderColor: 'black'
    }
});
