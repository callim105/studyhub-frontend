import Constants from "expo-constants";
const { manifest } = Constants;
const uri = `http://${manifest.debuggerHost.split(':').shift()}:3000/hubs`;



export function addHub(state){
    return (dispatch) => {
        console.log("Im fetching!")
        return fetch(uri, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accepts": "application/json",
            },
            body: JSON.stringify({
                hub: {
                    name: state.hubName,
                    latitude: state.addLocation.lat,
                    longitude: state.addLocation.lng,
                    wifi: state.hubWifi,
                    restrooms: state.hubRestrooms,
                    noise: state.hubNoise
                }
            })
        })
        .then(res => res.json())
        .then(hub => dispatch({type:'ADD_HUB', hub}))
    }
}

export function fetchHubs(){
    return dispatch => {
        return fetch(uri)
        .then(res => res.json())
        .then(hubs => {
            dispatch({type:'FETCH_HUBS', hubs})
        })
        .catch(err => console.error(err))
    }
}