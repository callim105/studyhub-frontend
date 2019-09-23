import { combineReducers } from 'redux'
import hubReducer from './hubReducer'


const rootReducer = combineReducers({
   hubs: hubReducer,
})

export default rootReducer