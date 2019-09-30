export default function reviewReducer(state = [], action){
    switch(action.type){
        case 'FETCH_REVIEWS':
            return action.reviews
        case 'ADD_REVIEW':
            
            return [...state, action.review]
        case 'UPDATE_REVIEW':
            return state.map(review =>{
                if(review.id === action.review.id){
                    return action.review
                } else {
                    return review
                }
            })
        case 'DELETE_REVIEW':
            return action.reviews
        default: 
            return state
    }
}