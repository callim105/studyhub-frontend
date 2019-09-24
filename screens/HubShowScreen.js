import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity} from 'react-native'
import AddReviewModal from '../components/AddReviewModal'
import { connect } from 'react-redux';


class HubShowScreen extends Component {
    constructor(props){
        super(props)
        this.state={
            modalVisible: false,
        }
        this.id = this.props.navigation.getParam('id', 'noId')
        // this.rating = this.props.navigation.getParam('rating', 'noRating')
        // this.name = this.props.navigation.getParam('name', 'noName')
        // this.reviewsLength = this.props.navigation.getParam('reviewsLength', 'noReviews')
        // this.reviews = this.props.navigation.getParam('reviews', 'noReviews')
        // this.description = this.props.navigation.getParam('description', 'noDescription')
    }

    getThisHub = () => {
        const currentHub = (this.props.hubs.filter(hub =>{
            return hub.id == this.id
        })[0])
        return currentHub
    }

    renderStars = (rating) => {
        if(rating){
            let numRating = Number(rating)
            let stars = []
            for(let i = 0; i < numRating; i++ ){
                stars.push('⭐')
            }
            return (stars.join(''))
        } else {
            return "No Reviews"
        }
    }

    //Calculates Rating
    calcRating = () => {
        const ratings = []
        let reviews = this.filterReviews()
        reviews.forEach(review => ratings.push(review.rating))
        let count = ratings.length;
        if(count > 0){
            let values = ratings.reduce((previous, current) => current += previous);
            return(Math.floor(values /= count));
        } else {
            return null
        }
        
       
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
        const currentHub = this.getThisHub()
        
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
                    <Text style={styles.name}>{currentHub.name}</Text>
                    <Text>Rating: {this.renderStars(this.calcRating())} ({this.filterReviews().length} Reviews)</Text>
                    <Text>Description:{currentHub.description}</Text>
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
        hubs: state.hubs,
        reviews: state.reviews
    })
}

export default connect(mapStateToProps)(HubShowScreen)