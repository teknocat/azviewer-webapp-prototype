// @flow

import * as actionTypes from '../constants/actionTypes';
import azviewerApi from '../api/azviewerApi'
import jwtDecode from 'jwt-decode';
import {pushState} from 'redux-router';

type Action = {
  +type: string,
  +payload?: {
    +token?: string,
    +status?: number,
    +statusText?: string
  },
}

type State = Object;

// https://flow.org/en/docs/frameworks/redux/#toc-typing-redux-thunk-actions
type GetState = () => State;
type PromiseAction = Promise<Action>;
type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;

// https://github.com/joshgeller/react-redux-jwt-auth-example/blob/master/src/actions/index.js

export function loginUserRequest(): Action {
  return {
    type: actionTypes.AUTH_LOGIN_USER_REQUEST
  }
}

export function logout() {
  localStorage.removeItem('token');
  return {
    type: actionTypes.AUTH_LOGOUT_USER
  }
}

export function loginUserSuccess(token: string): Action {
  localStorage.setItem('token', token);
  return {
    type: actionTypes.AUTH_LOGIN_USER_SUCCESS,
    payload: {
      token: token
    }
  }
}

export function loginUserFailure(error: Object): Action {
  localStorage.removeItem('token');
  return {
    type: actionTypes.AUTH_LOGIN_USER_FAILURE,
    payload: {
      status: error.response.status,
      statusText: error.response.statusText
    }
  }
}

export function loginUser(userName: string, password: string, redirect: string ="/"): ThunkAction {
  return function(dispatch) {
    dispatch(loginUserRequest());
    return azviewerApi.getToken({userName, password})
      .then(response => {
        // console.log("loginUser");
        // console.log(response);
        try {
          // tokenを含まない場合は、何らかのmessageを持つ前提
          // TODO 微妙な実装なので直す
          if (!response.token) {
            throw new Error(response.message)
          }


          let decoded = jwtDecode(response.token);
          dispatch(loginUserSuccess(response.token));
          // router側で遷移させるので不要
          // dispatch(pushState(null, redirect));
        } catch (e) {
          if (e.message) {
            dispatch(loginUserFailure({
              response: {
                status: 403,
                statusText: e.message
              }
            }));

          } else {
            dispatch(loginUserFailure({
              response: {
                status: 403,
                statusText: 'Invalid token'
              }
            }));
          }
        }
      })
      .catch(error => {
        dispatch(loginUserFailure(error));
      })
  }
}
