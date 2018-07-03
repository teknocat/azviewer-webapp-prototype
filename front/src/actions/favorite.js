// @flow

import * as actionTypes from '../constants/actionTypes';
import azviewerApi from '../api/azviewerApi'
import {addPage, initPage} from './page'

type Action = {
  +type: string,
  +favorites?: Array<Favorite>
}

type State = Object;

// https://flow.org/en/docs/frameworks/redux/#toc-typing-redux-thunk-actions
type GetState = () => State;
type PromiseAction = Promise<Action>;
type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;

export function fetchFavoritesRequest() {
  return {
    type: actionTypes.FAVORITES_FETCH_REQUEST,
  };
}

export function setFavorites(favorites: Array<Favorite>) {
  return {
    type: actionTypes.FAVORITES_SET,
    favorites
  };
}

export function loadFavorites(auth: Auth): ThunkAction {
  return function (dispatch) {
    dispatch(fetchFavoritesRequest());
    return azviewerApi.getFavorites(auth)
      .then(favorites => {
        dispatch(initPage());
        dispatch(setFavorites(favorites));
      })
      .catch(error => {
        throw(error);
      })
  }
}

export function setMoreFavorites(favorites: Array<Favorite>) {
  return {
    type: actionTypes.FAVORITES_APPEND,
    favorites
  };
}

export function setEndFavorites() {
  return {
    type: actionTypes.FAVORITES_END
  };
}


export function loadMoreFavorites(auth: Auth, currentPage: number): ThunkAction {
  return function (dispatch) {
    dispatch(fetchFavoritesRequest());
    return azviewerApi.getFavorites(auth, currentPage+1)
      .then(favorites => {
        // TODO エラー処理確認
        if (favorites.length > 0) {
          dispatch(addPage(currentPage));
          dispatch(setMoreFavorites(favorites));
        } else if (favorites.length === 0) {
          dispatch(setEndFavorites());
        }
      })
      .catch(error => {
        throw(error);
      })
  }
}

export function addFavorite(auth: Auth, workId: number): ThunkAction {
  return function (dispatch) {
    return azviewerApi.addFavorite(auth, workId)
      .then(favorite => {
        dispatch(add());
      })
      .then(() => {   // TODO fetchFavoritesと処理まとめる
        azviewerApi.getFavorites(auth)
          .then(favorites => {
            dispatch(setFavorites(favorites));
          })
      })
      .catch(error => {
        throw(error);
      })
  }
}

export function add() {
  return {
    type: actionTypes.FAVORITE_ADD
  };
}

export function removeFavorite(auth: Auth, favoriteId: string): ThunkAction {
  return function (dispatch) {
    return azviewerApi.removeFavorite(auth, favoriteId)
      .then(dummy => {
        dispatch(remove());
      })
      .then(() => {   // TODO fetchFavoritesと処理まとめる
        azviewerApi.getFavorites(auth)
          .then(favorites => {
            dispatch(setFavorites(favorites));
          })
      })
      .catch(error => {
        throw(error);
      })
  }
}

export function remove() {
  return {
    type: actionTypes.FAVORITE_REMOVE
  };
}

export function clearFavorites(): ThunkAction {
  return function (dispatch) {
    dispatch({ type: actionTypes.FAVORITES_CLEAR });
  }
}