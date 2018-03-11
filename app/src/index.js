import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import 'bootstrap/dist/css/bootstrap.css';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import registerServiceWorker from './registerServiceWorker';
import rootReducer from './reducers';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
// import {selectState, fetchState} from './actions';

// const store = createStore(rootReducer)

const loggerMiddleware = createLogger()
 
const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware // neat middleware that logs actions
  )
)

// store.dispatch(selectState('VA'))
// store
//   .dispatch(fetchState('VA'))
//   .then(() => console.log(store.getState()))


// const unsubscribe = store.subscribe(() =>
//   console.log(store.getState())
// )

// unsubscribe();

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
);
registerServiceWorker();
