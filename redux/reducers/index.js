import { combineReducers } from 'redux'
import hubReducer from './hubReducer'
import reviewReducer from './reviewReducer'
import userReducer from './userReducer'
import imageReducer from './imageReducer'

const rootReducer = combineReducers({
   user: userReducer,
   hubs: hubReducer,
   reviews: reviewReducer,
   images: imageReducer

})

export default rootReducer