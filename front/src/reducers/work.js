// @flow

import * as actionTypes from '../constants/actionTypes';
import initialState from './initialState';

type State = {
  +data: Array<Work>,
  +isFetching: boolean
};

export default function(state: State = initialState.works, action: Object): State {
  switch (action.type) {
    case actionTypes.WORKS_FETCH_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      });
    case actionTypes.WORKS_SET:
      return Object.assign({}, state, {
        data: action.works,
        isFetching: false
      });
    case actionTypes.WORKS_CLEAR:
      return Object.assign({}, state, {
        data: [],
        isFetching: false
      });

    case actionTypes.WORKS_APPEND:
      return Object.assign({}, state, {
        data: [...state.data, ...action.works],
        isFetching: false
      });

    case actionTypes.WORKS_END:
      return Object.assign({}, state, {
        data: [...state.data],
        isFetching: false
      });

    case actionTypes.WORKS_SEARCH_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      });
  }
  return state;
}
