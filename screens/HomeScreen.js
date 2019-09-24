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

import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Map from '../components/Map'

import { connect } from 'react-redux'
import { fetchHubs } from '../redux/actions/hubActions'
import { fetchReviews } from '../redux/actions/reviewActions'

class HomeScreen extends React.Component{
    constructor(props){
        super(props)
        this.state = { 
            isLoading: true,
            location: {
                lat:42.8781,
                lng:-86.6298
            },
            isFetchingLocation: false,
        }
    }

    //Get User Location
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





    //Fetches initial hubs
    componentDidMount(){
        this.getLocation()
        this.props.fetchHubs()
        this.props.fetchReviews()
        this.setState({isLoading: false})
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
                <Map 
                    hubs={this.props.hubs} 
                    renderStars={this.renderStars}
                    renderLocation={this.renderLocation}
                />
                <HubScroll 
                    isLoading={this.state.isLoading} 
                    hubs={this.props.hubs} 
                    renderStars={this.renderStars}
                    navigation={this.props.navigation}
                />
            </View>
          );
    }
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

const mapStateToProps = state => {
    return { hubs: state.hubs }
}

export default connect(mapStateToProps, { fetchHubs, fetchReviews })(HomeScreen);