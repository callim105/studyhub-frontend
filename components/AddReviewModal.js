import React, { Component } from 'react'
import {
    View, 
    Text, 
    Modal, 
    TouchableOpacity, 
    Alert, 
    StyleSheet, 
    AsyncStorage,
    TextInput,
    Picker
} from 'react-native'

import { connect } from 'react-redux';
import { addReview } from '../redux/actions/reviewActions';
import { fetchUser } from '../redux/actions/userActions'

class AddReviewModal extends Component {
    constructor(props){
        super(props)
        this.state = {
            currentUser: this.props.user,
            hubId: this.props.hubId,
            content: "",
            rating: 3
        }
    }

    //Passed HubId in as props


    componentDidMount(){
        this.props.fetchUser()
    }

   

    render() {
        return (
            <View>
                <Modal
                animationType="slide"
                transparent={false}
                visible={this.props.modalVisible}
                onRequestClose={() => {
                 Alert.alert('Modal has been closed.');
                }}>
                    <View style={{marginTop: 50}}>
                        <View style={styles.reviewModal}>
                        <Text>Add a Review!</Text>
                        <Text>Rating</Text>
                        <View>
                            <Picker 
                                selectedValue={this.state.rating}
                                onValueChange = {value => this.setState({rating: value})}
                                style={{heigh: 50, width: 100}}
                            >
                                <Picker.Item label = "1" value={1} />
                                <Picker.Item label = "2" value={2} />
                                <Picker.Item label = "3" value={3} />
                                <Picker.Item label = "4" value={4} />
                                <Picker.Item label = "5" value={5} />
                            </Picker>
                        </View>


                        <Text>Review</Text>
                        <TextInput 
                            style={styles.reviewTextInput} 
                            placeholder="Enter Review..." 
                            multiline={true}
                            autoCapitalize="sentences"
                            onChangeText={content => this.setState({content: content})}
                            value={this.state.content}
                        />
                        
                        <TouchableOpacity
                            onPress={() => {
                                this.props.addReview(this.state)
                                this.props.setModalVisible(!this.props.modalVisible)
                            }}
                        >
                            <Text>
                                Submit Review
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            onPress={() => {
                            this.props.setModalVisible(!this.props.modalVisible);
                            }}>
                            <Text>Back</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    reviewModal:{
        alignItems: 'center',
    },
    reviewTextInput:{
        width: 200,
        height: 70,
        borderWidth: 1,
        borderColor: 'black'
    }
})

const mapStateToProps = (state) => {
    return ({
        user: state.user,
        reviews: state.reviews,
        images: state.images
    })
}


export default connect(mapStateToProps, { addReview, fetchUser })(AddReviewModal);