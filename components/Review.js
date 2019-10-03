import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Alert, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { updateReview, deleteReview } from '../redux/actions/reviewActions';
import UserShowModal from './UserShowModal';


class Review extends Component {
    constructor(props){
        super(props)
        this.state={
            modalVisible: false,
            content: this.props.review.content,
            userShowModal: false
        }
    }

    setModalVisible(visible){
        this.setState({modalVisible: visible})
    }

    setUserModalVisible = (visible) => {
        this.setState({userShowModal: visible})
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

    renderUserModal = () => {
        this.setUserModalVisible(!this.state.userShowModal)
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
        
        return (
            <View style={styles.indyReview}>
                <View style={styles.reviewContent}>
                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                        <TouchableOpacity onPress={this.renderUserModal} style={styles.username}>
                            <Image source={{uri: this.props.review.user.avatar}} style={{height: 20, width: 20, borderRadius: 10}}/>
                            <Text style={{color: 'darkslateblue', fontSize: 15}}>{this.props.review.user.username}</Text>
                        </TouchableOpacity>
                        {this.renderEditButton()}
                    </View>
                    <Text>{this.props.renderStars(this.props.review.rating)}</Text>
                    <Text>{this.props.review.content}</Text>
                    <Text style={{color: 'grey', fontSize: 10}}>Posted: {this.props.review.created_at.split("T")[0]} </Text>
                </View>

                <UserShowModal 
                    userShowModal={this.state.userShowModal}
                    setUserModalVisible={this.setUserModalVisible}
                    user={this.props.review.user}
                />

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
    indyReview:{
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        width: '80%',
        alignItems: 'flex-start',
        padding: 10,
        backgroundColor:'#e9ebee'
    },
    editReviewModal:{
        marginTop:150,
        opacity: 0.95,
        backgroundColor:'whitesmoke',
        alignItems: 'center',
        height: 330, 
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 20
    },
    reviewText:{
        height: 200,
        width: 300,
        borderColor: 'black',
        borderWidth: 1,
        color: 'black'
    },
    text:{
        color:'white'
    },
    editTitle:{
        color:"black",
        fontSize: 25,
    },
    buttonsContainer:{
        alignItems:'center',
        justifyContent:"center",
        paddingVertical: 15,
        paddingBottom: 15,
        width: '100%',
    
    },
    submit:{
        backgroundColor: '#1675AA',
        width: "100%",
        height: 40,
        borderRadius: 4,
        justifyContent:"center",
        alignItems: 'center',
    },
    username:{
        flexDirection:'row',
    },
    reviewContent:{
        width: '100%',
        backgroundColor:'whitesmoke',
        opacity: 0.8,
        borderRadius: 10,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4
    }
})

const mapStateToProps = (state) => {
    return({
        user: state.user,
        reviews: state.reviews
    })
}

export default connect(mapStateToProps, { updateReview, deleteReview })(Review);