// @flow

import * as actionTypes from '../constants/actionTypes';
import initialState from './initialState';

type State = {
  +data: Array<Work>,
  +isFetching: boolean
}

export default function(state: State = initialState.favorites, action: Object): State {
  switch (action.type) {
    case actionTypes.FAVORITES_FETCH_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      });
    case actionTypes.FAVORITES_SET:
      return Object.assign({}, state, {
        data: action.favorites,
        isFetching: false
      });
    case actionTypes.FAVORITES_CLEAR:
      return Object.assign({}, state, {
        data: [],
        isFetching: false
      });

    case actionTypes.FAVORITES_APPEND:
      return Object.assign({}, state, {
        data: [...state.data, ...action.favorites],
        isFetching: false
      });

    case actionTypes.FAVORITES_END:
      return Object.assign({}, state, {
        data: [...state.data],
        isFetching: false
      });
  }
  return state;
}
