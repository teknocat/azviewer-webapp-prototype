// @flow

import * as actionTypes from '../constants/actionTypes';
import azviewerApi from '../api/azviewerApi'
import {addPage, initPage} from './page'

type Action = {
  +type: string,
  +people?: Array<Person>
}

type State = Object;

// https://flow.org/en/docs/frameworks/redux/#toc-typing-redux-thunk-actions
type GetState = () => State;
type PromiseAction = Promise<Action>;
type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;

export function clearPeople() {
  return {
    type: actionTypes.PEOPLE_CLEAR,
  };
}

export function fetchPeopleRequest() {
  return {
    type: actionTypes.PEOPLE_FETCH_REQUEST,
  };
}

export function setPeople(people: Array<Person>) {
  // console.log(people);
  return {
    type: actionTypes.PEOPLE_SET,
    people
  };
}

export function loadPeople(categoryKey: string): ThunkAction {
  return function (dispatch) {
    dispatch(clearPeople());
    dispatch(fetchPeopleRequest());

    return azviewerApi.getAllPeople(categoryKey)
      .then(people => {
        dispatch(initPage());
        dispatch(setPeople(people));
      })
      .catch(error => {
        throw(error);
      })
  }
}

export function setMorePeople(people: Array<Person>) {
  return {
    type: actionTypes.PEOPLE_APPEND,
    people
  };
}

export function setEndPeople() {
  return {
    type: actionTypes.PEOPLE_END
  };
}

export function loadMorePeople(categoryKey: string, currentPage: number): ThunkAction {
  return function (dispatch) {
    dispatch(fetchPeopleRequest());

    return azviewerApi.getAllPeople(categoryKey, currentPage+1)
      .then(people => {
        // TODO エラー処理確認
        if (people.length > 0) {
          dispatch(addPage(currentPage));
          dispatch(setMorePeople(people));
        } else if (people.length === 0) {
          dispatch(setEndPeople());
        }
      })
      .catch(error => {
        throw(error);
      })
  }
}

export function searchPeopleRequest() {
  return {
    type: actionTypes.PEOPLE_SEARCH_REQUEST,
  };
}

export function searchPeople(keyword: string): ThunkAction {
  return function (dispatch) {
    dispatch(clearPeople());
    dispatch(searchPeopleRequest());

    return azviewerApi.searchPeople(keyword)
      .then(people => {
        dispatch(initPage());
        dispatch(setPeople(people));
      })
      .catch(error => {
        throw(error);
      })
  }
}

