// import { combineReducers } from 'redux'
import {
  SELECT_CONGRESSMAN,
  SELECT_STATE,
  RESET,
} from '../actions'

const initialState = {
  view: "country", //country, state, or congressman
  currState: null,
  currCid: null,
}
 
function reducer(state = initialState, action) {
  switch (action.type) {
    case SELECT_CONGRESSMAN:
      console.log(action);
      return Object.assign({}, state, {
        view: "congressman",
        currCid: action.cid,
      });
    case SELECT_STATE:
      return Object.assign({}, state, {
        view: "state",
        currState: action.stateName,
      });
    case RESET:
      return initialState;
    default:
      return state
  }
}
 
export default reducer;