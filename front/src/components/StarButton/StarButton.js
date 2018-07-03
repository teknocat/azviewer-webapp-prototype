// @flow

import React from 'react';
import Button from '../Button';

export default class StarButton extends React.Component {
  props: {
    onChange: (starred: boolean) => void,
  };

  renderStar() {
    return <Button onClick={() => this.props.onChange(true)}>
      <span>Star</span>
      <span className="Star-star">☆</span>
    </Button>;
  }

  renderUnstar() {
    return <Button onClick={() => this.props.onChange(false)}>
      <span>Unstar</span>
      <span className="Star-unstar">★</span>
    </Button>;
  }

  render() {
    return <span className="Star">
      {this.props.starred ? this.renderUnstar() : this.renderStar()}
    </span>;
  }
}
