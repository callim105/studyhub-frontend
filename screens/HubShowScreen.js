import React, { Component } from 'react'
import { View, Text, Button } from 'react-native'




export default class HubShowScreen extends Component {
    constructor(props){
        super(props)
        this.id = this.props.navigation.getParam('id', 'noId')
        this.rating = this.props.navigation.getParam('rating', 'noRating')
        this.name = this.props.navigation.getParam('name', 'noName')
    }


    render() {
        return (
            <View>
                <Text>Hi this is a show page</Text>
                <Text>{this.id}{this.rating}{this.name}</Text>
                <Button title="Go Home" />
            </View>
        )
    }
}
