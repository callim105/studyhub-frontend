import React, { Component } from 'react'
import { View, Text, Button, StyleSheet, Image, ScrollView } from 'react-native'




export default class HubShowScreen extends Component {
    constructor(props){
        super(props)
        this.id = this.props.navigation.getParam('id', 'noId')
        this.rating = this.props.navigation.getParam('rating', 'noRating')
        this.name = this.props.navigation.getParam('name', 'noName')
        this.reviewsLength = this.props.navigation.getParam('reviewsLength', 'noReviews')
        this.reviews = this.props.navigation.getParam('reviews', 'noReviews')
    }

    renderStars = (rating) => {
        let numRating = Number(rating)
        let stars = []
        for(let i = 0; i < numRating; i++ ){
            stars.push('⭐')
        }
        return (stars.join(''))
    }

    renderReviews = () => {
        return this.reviews.map(review => (
            <View key={review.id}>
                <Text>User: {review.user_id}</Text>
                <Text>{review.content}</Text>
            </View>
        ))
    }

    render() {
        console.log(this.reviews)
        return (
            <View styles={styles.screen}>
                <View styles={styles.imageContainer}>
                    <Image source={require('../assets/images/Study_Hub.png')} style={{height:300, width:'100%'}}/>
                </View>
                <View>
                    <Text style={styles.name}>{this.name}</Text>
                    <Text>Rating: {this.renderStars(this.rating)} ({this.reviewsLength} Reviews)</Text>
                    
                </View>
                <ScrollView>
                    <Button title="Add A Review" />
                    {this.renderReviews()}
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    name: {
        fontSize: 30,
    },
    imageContainer:{
        flex: 1,
        width:'100%'
    }
})