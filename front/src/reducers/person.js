// @flow

import * as actionTypes from '../constants/actionTypes';
import initialState from './initialState';

type State = {
  +data: Array<Person>,
  +isFetching: boolean
};

export default function(state: State = initialState.people, action: Object): State {
  switch (action.type) {
    case actionTypes.PEOPLE_FETCH_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      });
    case actionTypes.PEOPLE_SET:
      return Object.assign({}, state, {
        data: action.people,
        isFetching: false
      });
    case actionTypes.PEOPLE_CLEAR:
      return Object.assign({}, state, {
        data: [],
        isFetching: false
      });

    case actionTypes.PEOPLE_APPEND:
      return Object.assign({}, state, {
        data: [...state.data, ...action.people],
        isFetching: false
      });

    case actionTypes.PEOPLE_END:
      return Object.assign({}, state, {
        data: [...state.data],
        isFetching: false
      });

    case actionTypes.PEOPLE_SEARCH_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      });
  }
  return state;
}
