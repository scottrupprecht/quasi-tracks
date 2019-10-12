import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import ReactGA from 'react-ga';

import './scss/quasi-tracks.scss';

import reducer from './modules/reducer';
import middleware from './modules/middleware';

import App from './App';
ReactGA.initialize('UA-149901907-1');

const store = createStore(reducer, _.includes(window.location.host, 'localhost') ? composeWithDevTools(middleware) : middleware);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
