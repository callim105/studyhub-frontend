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



export default class UserShowModal extends Component {
    constructor(){
        super()

    }


    render() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.props.userShowModal}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
            }}>
                <View style={styles.userContainer}>
                    <View>
                        <Image source={{uri: this.props.user.avatar}} style={styles.avatar}/>
                    </View>
                    <View>
                        <Text style={styles.username}>{this.props.user.username}</Text>
                    </View>
                    <View style={{paddingBottom: 10}}>
                        <Text style={styles.bio}>Bio: {this.props.user.bio}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.closeModal}
                        onPress={() => this.props.setUserModalVisible(!this.props.userShowModal)}
                        >
                        <Text style={{color:'white'}}>Close</Text>
                    </TouchableOpacity>
                </View>


            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    closeModal:{
        backgroundColor: '#1675AA',
        width: "90%",
        height: 40,
        borderRadius: 4,
        justifyContent:"center",
        alignItems: 'center',
        color:'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4
    },
    userContainer:{
        marginTop:150,
        opacity: 0.95,
        backgroundColor:'whitesmoke',
        alignItems: 'center',
        height: 330, 
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 20
    },
    avatar:{
        borderRadius: 100,
        borderWidth: 2,
        borderColor: 'white',
        height: 200,
        width: 200
    },
    username:{
        fontSize: 30
    },
})