// @flow

import React from 'react';
import { Link } from 'react-router';
import Iframe from 'react-iframe';
import config from '../../config';

class WorkBody extends React.Component {
  props: {
    work: Work
  };

  // TODO 親の領域に収まるようにする
  // TODO iframe以外の表示方法も検討
  render() {
    const { work } = this.props;

    if (config[process.env.NODE_ENV].displayWorkBody) {
      return <Iframe url={work.xmlUrl}
                     width="100%" position="relative"
      />;
    } else {
      return <div
        className="NoteBody"
        dangerouslySetInnerHTML={{ __html: work.xmlUrl }}
      />;
    }
  }
}

export default WorkBody;