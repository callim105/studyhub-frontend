import React, { Component } from 'react'
import {
    View, 
    Text, 
    Modal, 
    TouchableOpacity, 
    Alert, 
    StyleSheet, 
    TextInput,
    
} from 'react-native'

import { connect } from 'react-redux'
import { updateBio } from '../redux/actions/userActions'


class EditBioModal extends Component {
    constructor(props){
        super(props)
        this.state={
            bio: ""
        }
    }

    render(){
        
        return(
            <Modal
            animationType="slide"
            transparent={true}
            visible={this.props.modalVisible}
            onRequestClose={() => {
                Alert.alert('Modal has been closed.');
            }}>
                <View style={styles.editBioModal }>
                    <View>
                        <Text style={styles.editTitle}>Edit Bio</Text>
                        <TextInput 
                            placeholder="Enter New Bio..." 
                            style={styles.bioText}
                            multiline={true}
                            autoCapitalize="sentences"
                            maxLength={250}
                            onChangeText={content => this.setState({bio: content})}
                            value={this.state.bio}
                        />
                        <View style={styles.buttonsContainer}>

                            <TouchableOpacity
                                style={styles.submit}
                                onPress={() => {
                                    this.props.updateBio(this.props.user, this.state.bio)
                                    this.props.setModalVisible(!this.props.modalVisible)
                                }}
                            >
                                <Text style={styles.text}>Submit Changes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                this.props.setModalVisible(!this.props.modalVisible);
                                }}>
                                <Text style={styles.text}>Back</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    editBioModal:{
        marginTop:150,
        opacity: 0.95,
        backgroundColor:'#e8e5d6',
        alignItems: 'center',
        height: 330, 
    },
    bioText:{
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
        user: state.user
    })
}


export default connect(mapStateToProps, { updateBio })(EditBioModal);