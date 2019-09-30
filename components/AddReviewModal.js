import React, { Component } from 'react'
import {
    View, 
    Text, 
    Modal, 
    TouchableOpacity, 
    Alert, 
    StyleSheet, 
    TextInput,
    Picker,
    Image
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
                    <View>
                        <View style={styles.reviewModal}>
                            <View style={styles.title}>
                                <Image source={require('../assets/images/study_logo.png')} style={{height: 50, width: 50}}/>
                                <Text style={{fontSize: 40, color:'white'}}>Add a Review!</Text>
                            </View>
                            <View style={styles.picker}>
                                <Text style={styles.rating}>Rating: </Text>
                                <Text style={styles.rating}>{this.props.renderStars(this.state.rating)}</Text>
                            </View>
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
                            


                            <Text>Review</Text>
                            <TextInput 
                                style={styles.reviewTextInput} 
                                placeholder="Enter Review..." 
                                multiline={true}
                                autoCapitalize="sentences"
                                onChangeText={content => this.setState({content: content})}
                                value={this.state.content}
                                blurOnSubmit={true}
                            />
                            <View style={{paddingTop: 10, width: '100%', alignItems:'center', justifyContent:'space-between', height: 100}}>
                                <TouchableOpacity
                                    style={styles.submit}
                                    onPress={() => {
                                        this.props.addReview(this.state)
                                        this.props.setModalVisible(!this.props.modalVisible)
                                    }}
                                >
                                    <Text style={{color:'white', fontSize: 20}}>
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
                    </View>
                </Modal>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    title:{
        backgroundColor: '#1675AA',
        width: '100%',
        alignItems:'center',
        paddingTop: 50
    },
    reviewModal:{
        alignItems: 'center',
    },
    reviewTextInput:{
        width: 300,
        height: 70,
        borderWidth: 1,
        borderColor: 'black'
    },
    submit:{
        backgroundColor: '#1675AA',
        width: "80%",
        height: 40,
        borderRadius: 4,
        justifyContent:"center",
        alignItems: 'center',
        color:'white'
    },
    picker:{
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center'
    },
    rating: {
        fontSize: 20
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