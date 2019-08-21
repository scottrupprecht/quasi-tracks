import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import './scss/quasi-tracks.scss';

import reducer from './modules/reducer';
import middleware from './modules/middleware';

import App from './App';

const store = createStore(reducer, _.includes(window.location.host, 'localhost') ? composeWithDevTools(middleware) : middleware);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
