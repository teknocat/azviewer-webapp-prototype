import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory, useRouterHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import configureStore from './stores/configureStore';
import * as authActions from './actions/auth';
import getRoutes from './routes';
import { createHistory } from 'history';

// Using Bootstrap in a ES6 Webpack Application
// http://hydronitrogen.com/using-bootstrap-in-a-es6-webpack-application.html
import './styles.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

const store = configureStore();

// Local Storageからトークンを引っ張る
// react-redux-jwt-auth-example 参照
// TODO store.dispatchを直接呼び出す実装で良いか？
let token = localStorage.getItem('token');
if (token !== null) {
  store.dispatch(authActions.loginUserSuccess(token));
}

// const history = syncHistoryWithStore(browserHistory, store);

// Add <Routes baseHref> · Issue #353 · ReactTraining/react-router
// https://github.com/ReactTraining/react-router/issues/353
const history = useRouterHistory(createHistory)({
  basename: process.env.NODE_ENV === 'production' ? '/azviewer' : '/'
});

const routes = getRoutes();

ReactDOM.render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('app')
);

if (module.hot) {
  module.hot.accept();
}
