import { combineReducers } from 'redux'
import hubReducer from './hubReducer'
import reviewReducer from './reviewReducer'


const rootReducer = combineReducers({
   hubs: hubReducer,
   reviews: reviewReducer
})

export default rootReducer