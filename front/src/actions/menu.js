// @flow

import * as actionTypes from '../constants/actionTypes';

type Action = {
  +type: string,
}

type State = Object;

// https://flow.org/en/docs/frameworks/redux/#toc-typing-redux-thunk-actions
type GetState = () => State;
type PromiseAction = Promise<Action>;
type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;

export function open() {
  return {
    type: actionTypes.MENU_OPEN,
  };
}

export function close() {
  return {
    type: actionTypes.MENU_CLOSE,
  };
}

export function operateMenu(openState: boolean): ThunkAction {
  return function (dispatch) {
    if (openState) {
      dispatch(open());
    } else {
      dispatch(close());
    }
  }
}