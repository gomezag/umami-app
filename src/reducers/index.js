import { combineReducers } from 'redux';
import auth from "./auth";


const umamiApp = combineReducers({
  auth,
})

export default umamiApp;
