import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  AsyncStorage,

} from 'react-native';

import { MonoText } from '../components/StyledText';
import HubScroll from '../components/HubScroll';

//This is so you have a constant address to fetch, even on remote/if ip changes
import Constants from "expo-constants";
const { manifest } = Constants;
const uri = `http://${manifest.debuggerHost.split(':').shift()}:3000/hubs`;
// const uri = 'http://10.198.66.194:3000/hubs'


import Map from '../components/Map'


export default class HomeScreen extends React.Component{
    constructor(props){
        super(props)
        this.state = { 
            isLoading: true,
            hubs: [],
        }
    }

    //Fetches initial hubs
    componentDidMount(){
        console.log(uri)
        return fetch(uri)
        .then(res => res.json())
        .then(data => {
            this.setState({
                isLoading: false,
                hubs: data
            })
        })
        .catch(err => console.error(err))
    }

    renderStars = (rating) => {
        let numRating = Number(rating)
        let stars = []
        for(let i = 0; i < numRating; i++ ){
            stars.push('⭐')
        }
        return (stars.join(''))
    }
    //Render with loading screen for fetch
    render(){
        if(this.state.isLoading){
            return(
                <View style={{flex: 1, padding: 20}}>
                    <ActivityIndicator />
                </View>
            )
        }
        
        return (
            <View style={styles.container}>
                <Map hubs={this.state.hubs} renderStars={this.renderStars}/>
                <HubScroll 
                    isLoading={this.state.isLoading} 
                    hubs={this.state.hubs} 
                    renderStars={this.renderStars}
                    navigation={this.props.navigation}
                />
            </View>
          );
    }
}

const initialCoords = {
    latitude: 41.8781,
    longitude: -87.6298,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
}

//Navbar top options
HomeScreen.navigationOptions = {
  title: 'STUDYHUB',
  headerStyle: {
      backgroundColor: '#1675AA',
  },
  headerTintColor: '#fff',
  headerTitleStyle:{
      fontWeight: 'bold',
  },
  
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }

});
