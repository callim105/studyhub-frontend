import Constants from "expo-constants";
const { manifest } = Constants;
const uri = `http://${manifest.debuggerHost.split(':').shift()}:3000/reviews`;

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