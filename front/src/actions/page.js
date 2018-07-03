// @flow

import * as actionTypes from '../constants/actionTypes';

export function addPage(page: number) {
  return {
    type: actionTypes.PAGE_UP,
    page
  };
}

export function initPage() {
  return {
    type: actionTypes.PAGE_INIT,
  };
}
