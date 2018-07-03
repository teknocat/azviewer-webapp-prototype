// @flow

import * as actionTypes from '../constants/actionTypes';
import azviewerApi from '../api/azviewerApi'
import {addPage, initPage} from './page'

type Action = {
  +type: string,
  +works?: Array<Work>
}

type State = Object;

// https://flow.org/en/docs/frameworks/redux/#toc-typing-redux-thunk-actions
type GetState = () => State;
type PromiseAction = Promise<Action>;
type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;

export function clearWorks() {
  return {
    type: actionTypes.WORKS_CLEAR,
  };
}

export function fetchWorksRequest() {
  return {
    type: actionTypes.WORKS_FETCH_REQUEST,
  };
}

export function setWorks(works: Array<Work>) {
  return {
    type: actionTypes.WORKS_SET,
    works
  };
}

export function loadWorks(categoryKey: string, personId: number, workId:number ): ThunkAction {
  return function (dispatch) {
    dispatch(clearWorks());
    dispatch(fetchWorksRequest());
    if (workId) {
      return azviewerApi.getWork(workId)
        .then(works => {
          dispatch(initPage());
          // workId指定の場合は配列ではなくworkオブジェクトが返ってくるので整形必要
          dispatch(setWorks([ works ]));
        })
        .catch(error => {
          throw(error);
        })

    } else {
      return azviewerApi.getAllWorks(categoryKey, personId)
        .then(works => {
          dispatch(initPage());
          dispatch(setWorks(works));
        })
        .catch(error => {
          throw(error);
        })
    }
  }
}

export function setMoreWorks(works: Array<Work>) {
  return {
    type: actionTypes.WORKS_APPEND,
    works
  };
}

export function setEndWorks() {
  return {
    type: actionTypes.WORKS_END
  };
}

export function loadMoreWorks(categoryKey: string, personId: number, currentPage: number): ThunkAction {
  return function (dispatch) {
    dispatch(fetchWorksRequest());
    return azviewerApi.getAllWorks(categoryKey, personId, currentPage+1)
      .then(works => {
        // TODO エラー処理確認
        if (works.length > 0) {
          dispatch(addPage(currentPage));
          dispatch(setMoreWorks(works));
        } else if (works.length === 0) {
          dispatch(setEndWorks());
        }
      })
      .catch(error => {
        throw(error);
      })
  }
}

export function searchWorksRequest() {
  return {
    type: actionTypes.WORKS_SEARCH_REQUEST,
  };
}

export function searchWorks(keyword: string): ThunkAction {
  return function (dispatch) {
    dispatch(clearWorks());
    dispatch(searchWorksRequest());

    return azviewerApi.searchWorks(keyword)
      .then(works => {
        dispatch(initPage());
        dispatch(setWorks(works));
      })
      .catch(error => {
        throw(error);
      })
  }
}
