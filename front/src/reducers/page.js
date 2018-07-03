// @flow

import * as actionTypes from '../constants/actionTypes';
import initialState from './initialState';

type State = number;

export default function(state: State = initialState.page, action: Object): State {
  switch (action.type) {
    case actionTypes.PAGE_UP:
      return state + 1;
    case actionTypes.PAGE_INIT:
      return initialState.page;
  }
  return state;
}
