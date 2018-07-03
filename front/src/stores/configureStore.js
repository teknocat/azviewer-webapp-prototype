import { compose, createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from '../reducers/index';

const logger = process.env.NODE_ENV !== 'production' ? createLogger() : null;
const router = routerMiddleware(browserHistory);

// redux devtoolsを使うための設定
// javascript - Configure a redux store with redux devtools (the chrome extension) - Stack Overflow
// http://stackoverflow.com/questions/37764771/configure-a-redux-store-with-redux-devtools-the-chrome-extension
// productionの場合は使わない
let createStoreWithMiddleware;
if (process.env.NODE_ENV !== 'production') {
  createStoreWithMiddleware = compose(applyMiddleware(
    thunk, router, logger
  ), typeof window === 'object' && typeof window.devToolsExtension !== 'undefined'
    ? window.devToolsExtension()
    : f => f)(createStore);

} else {
  createStoreWithMiddleware = compose(applyMiddleware(
    thunk, router
  ), f => f)(createStore);
}

export default function configureStore(initialState) {
  return createStoreWithMiddleware(rootReducer, initialState);
}