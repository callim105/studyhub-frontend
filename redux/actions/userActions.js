import Constants from "expo-constants";
const { manifest } = Constants;
const uri = `http://${manifest.debuggerHost.split(':').shift()}:3000/profile`;
import { AsyncStorage } from 'react-native';

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

const getUser = () => {
    const jwt = _retrieveData('jwt');
    return jwt;
}

export function addUser(user) {
    return (dispatch) => {
        dispatch({ type: 'ADD_USER', user })
    }
}


export const fetchUser = () => async dispatch => {
    const token = await _retrieveData('jwt')

    return (fetch(uri, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(res => res.json())
        .then(user => {
            console.log('THIS IS A STRING', user)
            dispatch({ type: 'FETCH_USER', user })
        })
        .catch(err => console.error(err))
    )

}

export function loginUser() {
    const token = getUser()
    return dispatch => {
        return fetch(uri, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(user => {

                dispatch({ type: 'FETCH_USER', user })
            })
            .catch(err => console.error(err))
    }
}

//Update added Profile Photo
export function addProfileToUser(user) {
    return dispatch => dispatch({ type: 'ADD_PROFILE_PHOTO', user })
}