export default function userReducer(state = {}, action){
    switch(action.type){
        
        case 'FETCH_USER':
            return({
                id: action.user.user.id,
                username: action.user.user.username,
                avatar: action.user.user.avatar,
                bio: action.user.user.bio
            })
        case 'ADD_PROFILE_PHOTO':
            return action.user
        default: 
            return state
    }
}