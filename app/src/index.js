import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import 'bootstrap/dist/css/bootstrap.css';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import registerServiceWorker from './registerServiceWorker';
import reducer from './reducers'
import {
  selectCongressman,
  selectState,
  reset,
} from './actions'

const store = createStore(reducer)

console.log(store.getState());

const unsubscribe = store.subscribe(() =>
  console.log(store.getState())
)

store.dispatch(selectCongressman('TESTEST'));

unsubscribe();

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
);
registerServiceWorker();
