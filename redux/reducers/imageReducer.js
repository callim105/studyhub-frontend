export default function imageReducer(state = [], action){
    switch(action.type){
        case 'FETCH_IMAGES':

            return action.images
        case 'ADD_IMAGE':
            
            return [...state, action.image]
        default: 
            return state
    }
}