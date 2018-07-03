// @flow

import * as actionTypes from '../constants/actionTypes';
import initialState from './initialState';

type State = boolean;

export default function(state: State = initialState.star, action: Object): State {
  switch (action.type) {
    case actionTypes.FAVORITE_ADD:
      return true;
    case actionTypes.FAVORITE_REMOVE:
      return false;
  }
  return state;
}
