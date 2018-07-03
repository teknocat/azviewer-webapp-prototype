// @flow

import React, { Element, PropTypes } from 'react';
import { connect } from 'react-redux';

type Props = {
  children?: Element<any>;
  auth: Auth;
}
type State = void;

class GuestOnly extends React.Component<void, Props, State> {
  // TODO context使わない方法検討
  // https://facebook.github.io/react/docs/context.html#why-not-to-use-context
  // If you aren't familiar with state management libraries like Redux or MobX, don't use context.
  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  componentWillMount() {
    this.userWillTransfer(this.props, this.context.router);
  }

  componentWillUpdate(nextProps) {
    this.userWillTransfer(nextProps, this.context.router);
  }

  userWillTransfer(props, router) {
    if (props.auth.isLoggedIn) {
      router.replace('/');
    }
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}

function select({ auth }) {
  return { auth };
}

export default connect(select)(GuestOnly);