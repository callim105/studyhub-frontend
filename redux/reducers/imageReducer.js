export default function imageReducer(state = [], action){
    switch(action.type){
        case 'FETCH_IMAGES':

            return action.images
        case 'ADD_IMAGE':
            console.log(action.image)
            console.log(state)
            return [...state, action.image]
        default: 
            return state
    }
}