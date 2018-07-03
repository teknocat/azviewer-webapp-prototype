// @flow

import * as actionTypes from '../constants/actionTypes';
import initialState from './initialState';
import jwtDecode from 'jwt-decode';

type Action = {
  +type: string,
  +payload: {
    +token: string,
    +status: number,
    +statusText: string
  },
}

type State = Auth;

export default function(state: State = initialState.auth, action: Action): State {
  switch (action.type) {
    case actionTypes.AUTH_FETCH_USER:
      return {
        isFetching: true,
        user: {},
        error: undefined
      };

    case actionTypes.AUTH_LOGIN_USER_REQUEST:
      return {
        isFetching: true,
        user: {},
        error: undefined
      };

    case actionTypes.AUTH_LOGIN_USER_SUCCESS:
      // console.log(jwtDecode(action.payload.token));

      return {
        isPrepared: true,
        isLoggedIn: true,
        user: {
          id: jwtDecode(action.payload.token).userId,
          name: jwtDecode(action.payload.token).userName,
        },
        isFetching: false,
        error: undefined,
        jwt: action.payload.token
      };

    case actionTypes.AUTH_LOGIN_USER_FAILURE:
      return {
        isFetching: false,
        user: {},
        error: action.payload.statusText,
      };

    case actionTypes.AUTH_LOGOUT_USER:
      return Object.assign({}, initialState.auth, {
        user: {},
        isPrepared: true
      })

  }
  return state;
}
