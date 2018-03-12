import fetch from 'cross-fetch';

/*
 * action types
 */
 
export const SELECT_CONGRESSMAN = 'SELECT_CONGRESSMAN'
export const SELECT_STATE = 'SELECT_STATE'
export const RESET = 'RESET'
 
/*
 * action creators
 */
 
export function selectCongressman(bid) {
  return {
    type: SELECT_CONGRESSMAN,
    bid
  }
}
 
export function selectState(stateAbbrev) {
  return {
  	type: SELECT_STATE,
  	stateAbbrev
  }
}
 
export function reset() {
  return { type: RESET }
}


/*
* Async request/receieve/invalidate for state info
*/

export const REQUEST_STATE = 'REQUEST_STATE';
export const RECEIVE_STATE = 'RECEIVE_STATE';
export const INVALIDATE_STATE = 'INVALIDATE_STATE';

export function invalidateState(stateAbbrev) {
  return {
    type: INVALIDATE_STATE,
    stateAbbrev
  }
}


export function requestState(stateAbbrev) {
	return {
    	type: REQUEST_STATE,
    	stateAbbrev
  	}
}

export function receiveState(stateAbbrev, json) {
	console.log(json);
  return {
    type: RECEIVE_STATE,
    stateAbbrev,
    data: json,
    receivedAt: Date.now()
  }
}

export function fetchState(stateAbbrev) {
 	// Thunk middleware knows how to handle functions.
 	// It passes the dispatch method as an argument to the function,
  	// thus making it able to dispatch actions itself.
 
	return function (dispatch) {
		// First dispatch: the app state is updated to inform
		// that the API call is starting.
	 
		dispatch(requestState(stateAbbrev))
	 
		// The function called by the thunk middleware can return a value,
		// that is passed on as the return value of the dispatch method.
		 
		// In this case, we return a promise to wait for.
		// This is not required by thunk middleware, but it is convenient for us.

		return fetch(`/api/state/${stateAbbrev}`)
			.then(response => response.json())
			.then(json => dispatch(receiveState(stateAbbrev, json)))
	}
}

function shouldFetchState(state, stateAbbrev) {
	const data = state.dataByState[stateAbbrev]
	if (!data) {
		return true
	} else if (data.isFetching) {
		return false
	} else {
		return data.didInvalidate
	}
}

export function fetchStateIfNeeded(stateAbbrev) { 
  return (dispatch, getState) => {
    if (shouldFetchState(getState(), stateAbbrev)) {
      // Dispatch a thunk from thunk!
      return dispatch(fetchState(stateAbbrev))
    } else {
      // Let the calling code know there's nothing to wait for.
      return Promise.resolve()
    }
  }
}

/*
* Async request/receieve/invalidate for congressman info
*/

export const REQUEST_CONGRESSMAN = 'REQUEST_CONGRESSMAN';
export const RECEIVE_CONGRESSMAN = 'RECEIVE_CONGRESSMAN';
export const INVALIDATE_CONGRESSMAN = 'INVALIDATE_CONGRESSMAN';

export function invalidateCongressman(bid) {
  return {
    type: INVALIDATE_CONGRESSMAN,
    bid
  }
}


export function requestCongressman(bid) {
  return {
      type: REQUEST_CONGRESSMAN,
      bid
    }
}

export function receiveCongressman(bid, json) {
  console.log(json);
  return {
    type: RECEIVE_CONGRESSMAN,
    bid,
    data: json,
    receivedAt: Date.now()
  }
}

export function fetchCongressman(bid) {
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
    // thus making it able to dispatch actions itself.
 
  return function (dispatch) {
    // First dispatch: the app state is updated to inform
    // that the API call is starting.
   
    dispatch(requestCongressman(bid))
   
    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.
     
    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.

    return fetch(`/api/congressman/${bid}`)
      .then(response => response.json())
      .then(json => dispatch(receiveCongressman(bid, json)))
  }
}

function shouldFetchCongressman(state, bid) {
  const data = state.dataByCongressman[bid]
  if (!data) {
    return true
  } else if (data.isFetching) {
    return false
  } else {
    return data.didInvalidate
  }
}

export function fetchCongressmanIfNeeded(bid) { 
  return (dispatch, getState) => {
    if (shouldFetchCongressman(getState(), bid)) {
      // Dispatch a thunk from thunk!
      return dispatch(fetchCongressman(bid))
    } else {
      // Let the calling code know there's nothing to wait for.
      return Promise.resolve()
    }
  }
}