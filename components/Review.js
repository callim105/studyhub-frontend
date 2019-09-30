import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { updateReview, deleteReview } from '../redux/actions/reviewActions';


class Review extends Component {
    constructor(props){
        super(props)
        this.state={
            modalVisible: false,
            content: this.props.review.content
        }
    }

    setModalVisible(visible){
        this.setState({modalVisible: visible})
    }

    renderEditButton = () => {
        if(this.props.review.user.id === this.props.user.id){
            return(
            <TouchableOpacity
                        onPress={()=> this.setModalVisible(!this.state.modalVisible)}
                    >
                        <Ionicons name="md-create" size={20} color="black" />
            </TouchableOpacity>)
        }
    }

    handleDelete = () => {
        Alert.alert('Are you sure you want to delete this review?','This Review will be deleted forever!',[
            {text:'Cancel', style:'cancel'},
            {text:'Delete', 
            onPress: () => {
                this.props.deleteReview(this.props.review)
                this.setModalVisible(!this.state.modalVisible)
            }, 
            style:'destructive'}
        ])
    }



    render() {
        console.log(this.props.review)
        return (
            <View style={styles.indyReview}>
                <View style={{flexDirection:'row', justifyContent:'space-between', width:'100%'}}>
                    <Text style={{color: 'grey', fontSize: 15}}>User: {this.props.review.user.username} says...</Text>
                    {this.renderEditButton()}
                </View>
                <Text style={{color: 'grey', fontSize: 10}}>Posted: {this.props.review.created_at.split("T")[0]} </Text>
                <Text>{this.props.review.content}</Text>

                <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                }}>
                    <View style={styles.editReviewModal }>
                        <View style={{alignItems:'center'}}>
                            <View style={{flexDirection:'row', width: '90%', justifyContent:'space-around', alignItems:'flex-end'}}>
                                <Text style={styles.editTitle}>Edit Review</Text>
                                <TouchableOpacity
                                    onPress={this.handleDelete}
                                >
                                    <Text style={{color:'red'}}>Delete Review</Text>
                                </TouchableOpacity>
                            </View>
                            <TextInput 
                                placeholder="Edit Review..." 
                                style={styles.reviewText}
                                multiline={true}
                                autoCapitalize="sentences"
                                maxLength={250}
                                onChangeText={content => this.setState({content: content})}
                                value={this.state.content}
                            />
                            <View style={styles.buttonsContainer}>

                                <TouchableOpacity
                                    style={styles.submit}
                                    onPress={() => {
                                        this.props.updateReview(this.props.review,this.state.content)
                                        this.setModalVisible(!this.state.modalVisible)
                                    }}
                                >
                                    <Text style={styles.text}>Submit Changes</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                    this.setModalVisible(!this.state.modalVisible);
                                    }}>
                                    <Text style={styles.text}>Back</Text>
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
    indyReview:{
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        width: '80%',
        alignItems: 'flex-start',
        padding: 10
    },
    editReviewModal:{
        marginTop:150,
        opacity: 0.95,
        backgroundColor:'#e8e5d6',
        alignItems: 'center',
        height: 330, 
    },
    reviewText:{
        height: 200,
        width: 300,
        borderColor: 'black',
        borderWidth: 1,
        color: 'black'
    },
    text:{
        color:'black'
    },
    editTitle:{
        color:"black",
        fontSize: 25,
    },
    buttonsContainer:{
        alignItems:'center',
        justifyContent:"space-around",
        paddingVertical: 15,
        paddingBottom: 15
    },
    submit:{
        backgroundColor: '#1675AA',
        width: "100%",
        height: 40,
        borderRadius: 4,
        justifyContent:"center",
        alignItems: 'center',
    }
})

const mapStateToProps = (state) => {
    return({
        user: state.user,
        reviews: state.reviews
    })
}

export default connect(mapStateToProps, { updateReview, deleteReview })(Review);