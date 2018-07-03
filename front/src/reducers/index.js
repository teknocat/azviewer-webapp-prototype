import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import work from './work';
import person from './person';
import favorite from './favorite';
import star from './star';
import auth from './auth';
import page from './page';
import menu from './menu';

export default combineReducers({
  works: work,
  people: person,
  favorites: favorite,
  starred: star,
  auth,
  page,
  menu,
  routing: routerReducer
});