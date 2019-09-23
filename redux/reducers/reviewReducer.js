export default function reviewReducer(state = [], action){
    switch(action.type){
        case 'FETCH_REVIEWS':

            return state
        case 'ADD_REVIEW':
            
            return [...state, action.review]
        default: 
            return state
    }
}