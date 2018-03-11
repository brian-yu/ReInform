import { combineReducers } from 'redux'
import {
  SELECT_CONGRESSMAN,
  SELECT_STATE,
  RESET,
  INVALIDATE_STATE,
  REQUEST_STATE,
  RECEIVE_STATE,
} from '../actions'

function view(state = "country", action) {
  switch (action.type) {
    case SELECT_CONGRESSMAN:
      return "congressman"
    case SELECT_STATE:
      return "state"
    case RESET:
      return "country"
    default:
      return state
  }
}

function selectedState(state = null, action) {
  switch (action.type) {
    case SELECT_STATE:
      return action.stateAbbrev
    case RESET:
      return null
    default:
      return state
  }
}

function selectedCongressman(state = null, action) {
  switch (action.type) {
    case SELECT_CONGRESSMAN:
      return action.cid
    case RESET:
      return null
    default:
      return state
  }
}

function data(
  state = {
    isFetching: false,
    didInvalidate: false,
    data: {}
  },
  action
) {
  switch (action.type) {
    case INVALIDATE_STATE:
      return Object.assign({}, state, {
        didInvalidate: true
      })
    case REQUEST_STATE:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case RECEIVE_STATE:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        data: action.data,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}

function dataByState(state = {}, action) {
  switch (action.type) {
    case INVALIDATE_STATE:
    case RECEIVE_STATE:
    case REQUEST_STATE:
      return Object.assign({}, state, {
        [action.stateAbbrev]: data(state[action.stateAbbrev], action)
      })
    default:
      return state
  }
}

const rootReducer = combineReducers({
  view,
  selectedState,
  selectedCongressman,
  dataByState,
})
 
export default rootReducer