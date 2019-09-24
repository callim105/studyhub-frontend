

export function addUser(user){
    return (dispatch) => {
        dispatch({type: 'ADD_USER', user})
    }
}