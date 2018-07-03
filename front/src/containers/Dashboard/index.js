import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as workActions from '../../actions/work';
import * as personActions from '../../actions/person';
import * as favoriteActions from '../../actions/favorite';
import Dashboard from './presenter';

function mapStateToProps(state, ownProps) {
  const {works, people, favorites, auth, menu} = state;
  return {
    works,
    people,
    favorites,
    auth,
    menu
  }
}

// reactjs - How to wrap multi actionCreators into one props? - Stack Overflow
// https://stackoverflow.com/questions/44403700/how-to-wrap-multi-actioncreators-into-one-props
function mapDispatchToProps(dispatch) {
  return {
    workActions: bindActionCreators(workActions, dispatch),
    personActions: bindActionCreators(personActions, dispatch),
    favoriteActions: bindActionCreators(favoriteActions, dispatch),
  }
}

// こっちの形式はうまく行かない
// Redux · NativeBase
// http://docs.nativebase.io/docs/examples/ReduxCounterExample.html
// function mapDispatchToProps(dispatch) {
//   return bindActionCreators({
//     workActions: workActions,
//     personActions: personActions,
//     favoriteActions: favoriteActions,
//   }, dispatch)
// }

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
