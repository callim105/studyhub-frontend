import React, { Component } from 'react'
import { View, Text, Button, StyleSheet, Image, ScrollView, Modal, TouchableOpacity, Alert} from 'react-native'
import AddReviewModal from '../components/AddReviewModal'
import { connect } from 'react-redux';
import { fetchReviews } from '../redux/actions/reviewActions'

class HubShowScreen extends Component {
    constructor(props){
        super(props)
        this.state={
            modalVisible: false,
        }
        this.id = this.props.navigation.getParam('id', 'noId')
        this.rating = this.props.navigation.getParam('rating', 'noRating')
        this.name = this.props.navigation.getParam('name', 'noName')
        this.reviewsLength = this.props.navigation.getParam('reviewsLength', 'noReviews')
        this.reviews = this.props.navigation.getParam('reviews', 'noReviews')
        this.description = this.props.navigation.getParam('description', 'noDescription')
    }



    renderStars = (rating) => {
        let numRating = Number(rating)
        let stars = []
        for(let i = 0; i < numRating; i++ ){
            stars.push('⭐')
        }
        return (stars.join(''))
    }

    filterReviews = () => {
        return this.props.reviews.filter(review =>{
            return review.hub.id == this.id
        })
    }

    renderReviews = () => {
        return this.filterReviews().map(review => (
            <View key={review.id}>
                <Text>User: {review.user.username}</Text>
                <Text>{review.content}</Text>
            </View>
        ))
    }

    setModalVisible = (visible) => {
        this.setState({modalVisible: visible})
    }


    render() {
        console.log(this.props.reviews.map( review => review.hub.id))
        console.log('my hub id is', this.id)
        console.log(this.filterReviews())
        return (
            <View styles={styles.screen}>
                
                <AddReviewModal 
                    modalVisible={this.state.modalVisible} 
                    setModalVisible={this.setModalVisible}
                    hubId={this.id}
                />

                <View styles={styles.imageContainer}>
                    <Image source={require('../assets/images/Study_Hub.png')} style={{height:300, width:'100%'}}/>
                </View>
                <View>
                    <Text style={styles.name}>{this.name}</Text>
                    <Text>Rating: {this.renderStars(this.rating)} ({this.reviewsLength} Reviews)</Text>
                    <Text>Description:{this.description}</Text>
                </View>
                <ScrollView>
                    <TouchableOpacity
                        onPress={()=>{
                            this.setModalVisible(true)
                        }}
                    >
                        <Text>
                        Add Review
                        </Text>
                    </TouchableOpacity>
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
    },
    reviewModal:{
        alignItems: 'center',
    }
})

const mapStateToProps = (state) => {
    return ({
        reviews: state.reviews
    })
}

export default connect(mapStateToProps)(HubShowScreen)