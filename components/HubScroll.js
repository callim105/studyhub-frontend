import React, { Component } from 'react'
import { View, Text, ScrollView, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { Card } from 'react-native-elements'

import Constants from "expo-constants";
const { manifest } = Constants;
const uri = `http://${manifest.debuggerHost.split(':').shift()}:3000/hubs`;
// const uri = 'http://10.198.66.194:3000/hubs'



export default class HubScroll extends Component {
    constructor(props) {
        super(props)

    }


    render() {

        if (this.props.isLoading) {
            return (
                <View style={{ flex: 1, padding: 20 }}>
                    <ActivityIndicator />
                </View>
            )
        }

        return (
            <View style={{ flex: 1 }}>
                <View style={styles.hubTitleContainer}>
                    <Text style={styles.hubScrollTitle}>Hubs near you...</Text>
                </View>
                <ScrollView contentContainerStyle={{ paddingVertical: 5 }}>
                    {this.props.hubs.map(({ name, rating, id ,reviews}) => (
                        <Card key={id}>
                            <Text style={{ marginBottom: 10 }}>
                                {name}
                            </Text>
                            <Text>
                                Rating: {this.props.renderStars(rating)}
                            </Text>
                            <Button
                                title="View More"
                                
                                onPress={()=>{this.props.navigation.navigate('HubShow',{
                                    rating: rating,
                                    name: name,
                                    id: id,
                                    reviewsLength: reviews.length,
                                    reviews: reviews
                                })}}
                            />
                        </Card>
                    ))
                    }
                </ScrollView>
            </View>

        );
    }
}


const styles = StyleSheet.create({
    hubScrollTitle: {
        paddingLeft: 20,
        paddingVertical: 10,
        fontSize: 20,
        
    },
    hubTitleContainer:{
        borderBottomColor: 'black',
        borderBottomWidth: 1,
    }
})