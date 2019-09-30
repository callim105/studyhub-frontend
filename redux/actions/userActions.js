import Constants from "expo-constants";
const { manifest } = Constants;
const uri = `http://${manifest.debuggerHost.split(':').shift()}:3000/profile`;
const usersUri =`http://${manifest.debuggerHost.split(':').shift()}:3000/users` 
import { AsyncStorage } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

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



//User Location
verifyPermissions = async () => {
    const result = await Permissions.askAsync(Permissions.LOCATION);
    if(result.status !== 'granted'){
        Alert.alert(
            'Insufficient permissions!',
            'You need to grant location permissions to use this app.',
            [{text: 'okay'}]
        );
        return false;
    }
    return true;
};

export const currentLocation = () => async dispatch => {

    const hasPermission = await this.verifyPermissions()
    if(!hasPermission){
        return;
    }

    try{
        const location = await Location.getCurrentPositionAsync({timeout: 5000});
        dispatch({type:"GET_USER_LOCATION", location})
    } catch(err){
        Alert.alert('Could not fetch location',)
    }
        
}
    
//Update user bio
export const updateBio = (user, bio) => async dispatch => {
    const token = await _retrieveData('jwt')

    return (fetch(usersUri + '/' + user.id, {
        method: 'PATCH',
        headers: {
            "content-type":"application/json",
            "accept":"application/json",
            Authorization: `Bearer ${token}`
        },
        body:JSON.stringify({
            user:{
                bio: bio
            }
        })
    })
        .then(res => res.json())
        .then(user => dispatch({type:"UPDATE_BIO", user}))
        .catch(err => console.error(err))
    )
}