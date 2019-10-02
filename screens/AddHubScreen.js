import React, { Component } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity, 
    Button, 
    Alert, 
    TouchableWithoutFeedback,
    Keyboard,
    Image
} from 'react-native';

import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import NoiseRadioButtons from '../components/NoiseRadioButtons'

//redux stuff
import { connect } from 'react-redux';
import { addHub } from '../redux/actions/hubActions'
import { currentLocation } from '../redux/actions/userActions'
import BottomDrawer from 'rn-bottom-drawer';
import { MaterialIcons } from '@expo/vector-icons';
import COLORS from '../constants/Colors'

class AddHubScreen extends Component{
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
            hubNoise: 'low',
        };
    }

    componentDidMount(){
        this.props.currentLocation()
    }

    // componentWillReceiveProps(){
    //     this.setState({
    //         location:{
    //             lat: this.props.user.location.coords.latitude,
    //             lng: this.props.user.location.coords.longitude
    //         }
    //     })
    // }
   

    handleHubSubmit = () => {
        if(this.state.hubName && this.state.hubNoise && this.state.hubDescription){
            this.props.addHub(this.state)
            Alert.alert('Hub Added!')
            this.setState({
                hubName: '',
                hubWifi: false,
                hubDescription: '',
                hubRestrooms: false,
                hubNoise: 'low',
            })
        } else {
            Alert.alert('Please fill out the form!')
        }
        
    }


    addHubLocation = (e) => {
        this.setState({
            addLocation:{
                lat: e.nativeEvent.coordinate.latitude,
                lng: e.nativeEvent.coordinate.longitude
            }
        })
    }

    setNoiseLevel = (level) => {
        this.setState({hubNoise: level})
    }

    renderMapView = () => {
        if(this.props.user.location){
           
            let latitude = this.props.user.location.coords.latitude
            let longitude = this.props.user.location.coords.longitude
            
            return(
                <MapView
                    style={{ flex: 1 }}
                    initialRegion={{latitude: latitude,
                        longitude: longitude,
                        latitudeDelta: 0.00109,
                        longitudeDelta: 0.00099,}}
                >
                    <Marker
                    coordinate={{latitude: latitude, 
                    longitude: longitude}}
                    title="Place on Hub"
                    draggable
                    onDragEnd={
                        this.addHubLocation

                    }
                    >

                    </Marker>
                </MapView>  
            )
        } else {
            return(
                <MapView
                    style={{ flex: 1 }}
                    initialRegion={{latitude: this.state.location.lat,
                        longitude: this.state.location.lng,
                        latitudeDelta: 0.00109,
                        longitudeDelta: 0.00099,}}
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
            )
        }
    }

    render(){
            return(
                
                <View style={styles.container}>
                   
                   {this.renderMapView()}
                 
                       
                    <BottomDrawer
                        containerHeight={600}
                        offset={100}
                        startUp={false}
                        roundedEdges={true}
                        shadow={true}
                    >
                        <View style={styles.addFormContainer}>
                                <View style={{width:'100%', backgroundColor:'#e9ebee', alignItems:'center'}}>
                                    <View style={{alignItems:'center', float:'center', paddingBottom: 10}}>
                                    <MaterialIcons name="drag-handle" size={20} color="black" />
                                    </View>
                                    <View style={styles.addHubTitle}>
                                        <Text style={{
                                            paddingLeft: 20,
                                            paddingVertical: 10,
                                            fontSize: 20,
                                            color:'black'}}
                                        >
                                            Add a New Hub!
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.formContainer}>
                                    <Text style={styles.formTitles}>Name: </Text>
                                    <TextInput 
                                        style={styles.formInput} 
                                        onChangeText={name => this.setState({hubName: name})}
                                        value={this.state.hubName}
                                    
                                    />
                                    <Text style={styles.formTitles}>Description: </Text>
                                    <TextInput 
                                        style={styles.description} 
                                        multiline={true}
                                        autoCapitalize="sentences"
                                        onChangeText={text => this.setState({hubDescription: text})}
                                        value={this.state.hubDescription}
                                        blurOnSubmit={true}
                                    />
                                    
                                

                                    <View style={{flexDirection:'row', justifyContent:'space-around'}}>
                                        <View style={{alignItems:'center'}}>
                                            <Text style={styles.formTitles}>Wifi: </Text>
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
                                        </View>
                                        
                                        <View style={{alignItems:'center'}}>
                                            <Text style={styles.formTitles}>Restrooms</Text>
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
                                        </View>
                                    </View>
                                    <View style={{paddingBottom: 10}}>

                                        <Text style={styles.formTitles}>Noise Level</Text>
                                        <NoiseRadioButtons options={options} setNoiseLevel={this.setNoiseLevel}/>
                                        <Text>Drag the pin to your new Hub!</Text>
                                    </View>

                                    <TouchableOpacity style={styles.createButton} onPress={this.handleHubSubmit}>
                                        <Text style={{fontSize: 20, color:'white'}}>Submit Hub</Text>
                                    </TouchableOpacity>

                                </View>
                                
                        </View>
                    </BottomDrawer>
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
    headerTitle: 'Add a Hub',
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
        alignItems:'center',
        width: '100%',
        backgroundColor:'#e9ebee',
        height: '100%',
        
    },
    formInput:{
        width: "80%",
        height: 30,
        marginBottom: 10,
        backgroundColor: '#e9ebee',
        borderRadius: 10,
        borderColor: 'lightgrey',
        borderWidth: 1,
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
        borderRadius: 10,
        borderColor: 'lightgrey',
        borderWidth: 1,
        backgroundColor: '#e9ebee'
    },
    formContainer:{
        width: '90%',
        marginTop: 10,
        backgroundColor:'whitesmoke',
        borderRadius: 10,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4
    },
    addHubTitle:{
        alignItems: 'flex-start',
        width: '100%',
        backgroundColor:'whitesmoke',
        borderRadius: 10,
        width: '90%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4
    },
    formTitles:{
        fontSize: 20
    },
    createButton:{
        backgroundColor: '#1675AA',
        width: "100%",
        height: 40,
        borderRadius: 4,
        justifyContent:"center",
        alignItems: 'center',
    }
});


const mapStateToProps = (state)=>{
    return ({
        user: state.user
    })
}
export default connect(mapStateToProps, { addHub, currentLocation })(AddHubScreen);



 