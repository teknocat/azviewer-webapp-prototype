// @flow

import React from 'react';
import classnames from "classnames";

class Button extends React.Component {
  props: {
    size?: string;
    onClick: () => void;
    children?: React.Children<any>;
  };

  render() {
    const className = classnames({
      Button: true,
      'is-large': this.props.size === 'large',
    });
    return <button className={className} onClick={this.props.onClick}>{this.props.children}</button>;
  }

}

export default Button;