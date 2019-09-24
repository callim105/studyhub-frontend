import React, { Component } from 'react'
import { View, Text, ScrollView, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { Card } from 'react-native-elements'

import Constants from "expo-constants";
const { manifest } = Constants;
const uri = `http://${manifest.debuggerHost.split(':').shift()}:3000/hubs`;
// const uri = 'http://10.198.66.194:3000/hubs'
import HubCard from './HubCard'


export default class HubScroll extends Component {
    constructor(props) {
        super(props)

    }

    sortHubsByRating = () => {
        return(this.props.hubs.sort((a, b) => (a.rating > b.rating) ? -1 : (a.rating === b.rating) ? ((a.reviews.length > b.reviews.length) ? -1 : 1) : 1 ))
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
                    {this.sortHubsByRating().map(({ name, rating, id ,description, reviews}) => (
                        <HubCard 
                            key={id} 
                            name={name} 
                            rating={rating}
                            id={id} 
                            reviews={reviews} 
                            description={description}
                            renderStars={this.props.renderStars} 
                            navigation={this.props.navigation}
                        />
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