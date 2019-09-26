import React from 'react';
import { Text, Button, } from 'react-native';
import { Card } from 'react-native-elements'
import getDirections from 'react-native-google-maps-directions'
export default function HubCard(props){

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



    return (
        <Card>
            <Text style={{ marginBottom: 10 }}>
                {name}
            </Text>
            <Text>
                Rating: {props.renderStars(rating)}({reviews.length} reviews)
            </Text>
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
