// import { combineReducers } from 'redux'
import {
  SELECT_CONGRESSMAN,
  SELECT_STATE,
  RESET,
  MODIFY_MAP,
} from '../actions'
import stateCenters from '../stateCenters';

const initialState = {
  view: "country", //country, state, or congressman
  currState: null,
  currCid: null,
  // center: [-94.7, 37.830348],
  // zoom: 3.75,
}
 
function reducer(state = initialState, action) {
  switch (action.type) {
    case SELECT_CONGRESSMAN:
      console.log(action);
      return Object.assign({}, state, {
        view: "congressman",
        currCid: action.cid,
        // center: action.center,
        // zoom: 10,
      });
    case SELECT_STATE:
      return Object.assign({}, state, {
        view: "state",
        currState: action.stateName,
        // center: stateCenters[action.stateName],
        // zoom: 6,
      });
    case RESET:
      return initialState;
    // case MODIFY_MAP:
    //   return Object.assign({}, state, {
    //     center: action.center,
    //     zoom: action.zoom,
    //   });
    default:
      return state
  }
}
 
 
// const reinformApp = combineReducers({
//   visibilityFilter,
//   todos
// })
//  
export default reducer