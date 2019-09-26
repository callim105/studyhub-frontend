import Constants from "expo-constants";
const { manifest } = Constants;
const imageUri = `http://${manifest.debuggerHost.split(':').shift()}:3000/images`;

export function fetchImages(){
    return dispatch => {
        return fetch(imageUri)
        .then(res => res.json())
        .then(images => {
            dispatch({type:'FETCH_IMAGES', images})
        })
        .catch(err => console.error(err))
    }
}

export function addImage(image){
    return (dispatch) => {
        dispatch({ type: 'ADD_IMAGE', image })
    }
}