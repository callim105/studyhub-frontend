import React, { Component } from 'react'
import { View, Text, ScrollView, Button, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-elements'

import Constants from "expo-constants";
const { manifest } = Constants;
const uri = `http://${manifest.debuggerHost.split(':').shift()}:3000/hubs`;
// const uri = 'http://10.198.66.194:3000/hubs'


export default class HubScroll extends Component {
    constructor(props){
        super(props)
        
    }

    // componentDidMount(){
    //     console.log(uri)
    //     return fetch(uri)
    //     .then(res => res.json())
    //     .then(data => {
    //         this.setState({
    //             isLoading: false,
    //             hubs: data
    //         })
    //     })
    //     .catch(err => console.error(err))
    // }

    renderStars = (rating) => {
        let numRating = Number(rating)
        let stars = []
        for(let i = 0; i < numRating; i++ ){
            stars.push('⭐')
        }
        return (stars.join(''))
    }


    render() {

        if(this.props.isLoading){
            return(
                <View style={{flex: 1, padding: 20}}>
                    <ActivityIndicator />
                </View>
            )
        }

        return (
            <View style={{flex: 1}}>
              <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
                    {this.props.hubs.map(({ name, rating, id }) => (
                        <Card key={id}>
                            <Text style={{ marginBottom: 10 }}>
                                {name}
                            </Text>
                            <Text>
                                Rating: {this.renderStars(rating)}
                            </Text>
                            <Button
                            title="View More"
                            />
                        </Card>
                    ))
                    }
              </ScrollView>
            </View>
        
          );
    }
}


