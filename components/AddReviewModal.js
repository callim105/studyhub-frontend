import React, { Component } from 'react'
import {
    View, 
    Text, 
    Modal, 
    TouchableOpacity, 
    Alert, 
    StyleSheet, 
    AsyncStorage,
    TextInput
} from 'react-native'

import { connect } from 'react-redux'


class AddReviewModal extends Component {
    constructor(){
        super()
        this.state = {
            currentUser: {},
            content: ""
        }
    }

    //Passed HubId in as props

    _retrieveData = async (key) => {
        try {
          const value = await AsyncStorage.getItem(key);
          if (value !== null) {
            // We have data!!
            console.log(value);
            this.setState({
                currentUser: value
            })
          } else {
            console.log(value)
          }
        } catch (error) {
          // Error retrieving data
        }
    };

    componentDidMount(){
        this._retrieveData('user')
    }



    render() {
        console.log(this.state)
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

                        <Text>Review</Text>
                        <TextInput 
                            style={styles.reviewTextInput} 
                            placeholder="Enter Review..." 
                            multiline={true}
                            autoCapitalize="sentences"
                            onChangeText={content => this.setState({content: content})}
                            value={this.state.content}
                        />
                        
                        <TouchableOpacity>
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

export default AddReviewModal;