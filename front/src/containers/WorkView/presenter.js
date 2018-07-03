// @flow

import React from 'react';
import { bindActionCreators } from 'redux';
import WorkHeader from '../../components/WorkHeader/index'
import WorkBody from '../../components/WorkBody/index'

type Props = {
  work: Work;
  auth: Auth;
  router: Object;
  favoriteActions: bindActionCreators;
}

class WorkView extends React.Component {
  props: Props;

  // スタークリック時の動作をここで定義しておく (ref. spa-note)
  handleChangeStar(starred: boolean) {
    const { work, auth, router } = this.props;

    const userId = auth.user.id;

    if (starred) {
      // console.log("check star");
      this.props.favoriteActions.addFavorite(auth, work.workId);
    }
    else {
      // console.log("uncheck star");
      const favorite = work.favorite;
      if (favorite && favorite.favoriteId) {
        this.props.favoriteActions.removeFavorite(auth, favorite.favoriteId);
        // 削除後はお気に入り一覧に遷移(お気に入りを表示している時のみ)
        if (/^\/favorites/.test(router.location.pathname)) {
          router.push('/favorites');
        }
      } else {
        // console.error("favorite is null")
      }
    }
  }

  render() {
    const { work, auth } = this.props;
    if (!work) return null;

    return (
      <div style={{height: 'calc(100vh - 152px)'}}>
        <WorkHeader work={work} auth={auth} favorite={work.favorite} onChangeStar={this.handleChangeStar.bind(this)} />
        <WorkBody work={work} />
      </div>
    );
  }

}

export default WorkView;