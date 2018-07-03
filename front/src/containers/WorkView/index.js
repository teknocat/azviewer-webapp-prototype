import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as favoriteActions from '../../actions/favorite';
import WorkView from './presenter';

function mapStateToProps({ auth }, ownProps) {
  return { auth }
}

function mapDispatchToProps(dispatch) {
  return {
    favoriteActions: bindActionCreators(favoriteActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkView);
