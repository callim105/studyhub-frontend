import Constants from "expo-constants";
const { manifest } = Constants;
const uri = `http://${manifest.debuggerHost.split(':').shift()}:3000/reviews`;
import { AsyncStorage } from 'react-native'

//To get token from async
const _retrieveData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            // We have data!!
            return value
        }
    } catch (error) {
        // Error retrieving data
        throw error;
    }
};


export function addReview(state){
    return (dispatch) => {
        return fetch(uri, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accepts": "application/json",
            },
            body: JSON.stringify({
                user_id: state.currentUser.id,
                hub_id: state.hubId,
                rating: state.rating,
                content: state.content
            })
        })
        .then(res => res.json())
        .then(review => dispatch({type:'ADD_REVIEW', review}))
    }
}

export function fetchReviews(){
    return dispatch => {
        return fetch(uri)
        .then(res => res.json())
        .then(reviews => {
            dispatch({type:'FETCH_REVIEWS', reviews})
        })
        .catch(err => console.error(err))
    }
}

export const updateReview = (review, content) => async dispatch => {
    const token = await _retrieveData('jwt')

    return (fetch(uri + "/" + review.id, {
        method: 'PATCH',
        headers: {
            "content-type":"application/json",
            "accept":"application/json",
            Authorization: `Bearer ${token}`
        },
        body:JSON.stringify({
            review:{
                content: content
            }
        })
    })
        .then(res => res.json())
        .then(review => dispatch({type:'UPDATE_REVIEW', review: review}))
        .catch(err => console.error(err))
    )
}

export const deleteReview = (review) => async dispatch => {
    const token = await _retrieveData('jwt')

    return (fetch(uri + "/" + review.id, {
        method: 'DELETE',
        headers: {
            "content-type":"application/json",
            "accept":"application/json",
            Authorization: `Bearer ${token}`
        }
    })
        .then(res => res.json())
        .then(reviews => dispatch({type:'DELETE_REVIEW', reviews}))
        .catch(err => console.error(err))
    )
}