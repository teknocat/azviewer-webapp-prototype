// @flow

import * as actionTypes from '../constants/actionTypes';
import initialState from './initialState';

// TODO 型設定
type State = any;

export default function(state: State = initialState.menu, action: Object): State {
  switch (action.type) {
    case actionTypes.MENU_OPEN:
      return {
        isOpened: true,
      };
    case actionTypes.MENU_CLOSE:
      return {
        isOpened: false,
      };
  }
  return state;
}
