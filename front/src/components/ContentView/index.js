// @flow

import React from 'react';
import WorkView from '../../containers/WorkView/index'

type Props = {
  content: {
    type: string;
    data: Object;
  };
  router: Object;
}

type State = void

class ContentView extends React.Component<void, Props, State> {

  render() {
    const {content, router} = this.props;
    // TODO こういうチェックロジックが随所に入るのをなんとかしたい
    if (!content) return null;

    const {type, data} = content;
    if (!data) return null;

    // TODO typeによって場合分け
    // TODO routerを引き回さないで済む方法はないか？Workのpropsには現れない。connectしているからか。
    return (
      <div className="page-Content">
        <WorkView work={data} router={router} />
      </div>
    );
  }

}
export default ContentView;