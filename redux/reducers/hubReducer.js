export default function hubReducer(state = [], action){
    switch(action.type){
        case 'FETCH_HUBS':
            return state
        case 'ADD_HUB':
            console.log("hello!", action)
            return [...state, action.hub]
        default: 
            return state
    }
}