export default function userReducer(state = {}, action){
    switch(action.type){
        case 'ADD_USER':
            
            return ({
                id: action.user.id,
                username: action.user.username,
                avatar: action.user.avatar,
                bio: action.user.bio
            })
        default: 
            return state
    }
}