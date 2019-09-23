export default function hubReducer(state = [], action){
    switch(action.type){
        case 'FETCH_HUBS':

            return action.hubs
        case 'ADD_HUB':
            
            return [...state, action.hub]
        default: 
            return state
    }
}