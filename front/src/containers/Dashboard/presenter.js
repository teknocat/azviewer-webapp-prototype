// @flow

import React, { Element } from 'react';
import { Link, IndexLink } from 'react-router';
import { bindActionCreators } from 'redux';
import { Button, Glyphicon } from 'react-bootstrap';
import * as contentTypes from '../../constants/contentTypes';
import * as navigationTypes from '../../constants/navigationTypes';
import Navigation from '../../components/Navigation/index';
import Loading from '../../components/Loading';
import styles from './styles.css';
import SideMenu from '../SideMenu/index';

type Props = {
  params: any;
  routes: any;
  location: any;
  works: {
    data: Array<Work>;
    isFetching: boolean;
  };
  people: {
    data: Array<Person>;
    isFetching: boolean;
  };
  favorites: {
    data: Array<Favorite>;
    isFetching: boolean;
  };
  auth: Auth;
  menu: any;
  children?: Element<any>,

  workActions: bindActionCreators;
  personActions: bindActionCreators;
  favoriteActions: bindActionCreators;
}
type State = void;

class Dashboard extends React.Component<void, Props, State> {

  // 新規ページ読み込み時
  componentWillMount() {
    // console.log('vvv Dashboard componentWillMount.props vvv');
    // console.log(this.props);

    const token = this.props.auth.jwt;

    // 検索キーワード
    // TODO queryはハッシュなので、qのキーが存在するかチェックして存在すれば取得
    const q = this.props.location.query.q;
    const searchPerson = this.props.location.query.searchPerson == 'true';
    // console.warn(this.props.location.query);
    // console.warn("q="+q);
    // console.warn("searchPerson="+searchPerson);

    // 検索
    if (this.props.routes.find(r => r.path === '/search')) {
      if (q) {
        if (searchPerson) {
          // 作家名検索
          this.props.personActions.searchPeople(q);
        } else {
          // 作品検索
          this.props.workActions.searchWorks(q);
        }
        return;
      }
    }

    if (this.props.params.worksCategoryKey) {
      this.props.workActions.loadWorks(this.props.params.worksCategoryKey)
    }

    if (this.props.params.peopleCategoryKey) {
      this.props.personActions.loadPeople(this.props.params.peopleCategoryKey)
    }

    // 作家別作品一覧
    if (this.props.params.personId) {
      this.props.workActions.loadWorks(null, this.props.params.personId)
    }

    // 単一作品表示
    if (this.props.params.workId) {
      // 作品一覧はURLで直接来た場合のみ変更
      if (!this.props.works.isFetching && this.props.works.data.length === 0) {
        this.props.workActions.loadWorks(null, null, this.props.params.workId);
        // 作品のお気に入り状態を設定するために必要
        if (this.props.auth.user.id) {
          this.props.favoriteActions.loadFavorites(this.props.auth);
        }
      }
    }

    // お気に入り一覧＆単一お気に入り表示
    if (this.props.routes.find(r => r.path === '/favorites')) {
      if (this.props.auth.user.id) {
        this.props.favoriteActions.loadFavorites(this.props.auth);
      }
    }
  }

  // 同一ページ内遷移時
  componentWillReceiveProps(nextProps: Props) {
    // console.warn('vvv Dashboard componentWillReceiveProps.props vvv');
    // console.log(nextProps);

    const token = nextProps.auth.jwt;

    // 検索キーワード
    // TODO queryはハッシュなので、qのキーが存在するかチェックして存在すれば取得
    const q = nextProps.location.query.q;
    const searchPerson = nextProps.location.query.searchPerson == 'true';
    // console.warn(nextProps.location.query);
    // console.warn("q="+q);
    // console.warn("searchPerson="+nextProps.location.query.searchPerson);
    // console.warn("searchPerson="+searchPerson.toString());

    // 検索
    if (nextProps.routes.find(r => r.path === '/search')) {
      if (q) {
        if ((this.props.location.query.searchPerson == 'true') != searchPerson
          || this.props.location.query.q != q) {
          if (searchPerson) {
            // 作家名検索
            nextProps.personActions.searchPeople(q);
          } else {
            // 作品検索
            nextProps.workActions.searchWorks(q);
          }
          return;
        }
      }

    }

    // Also you may want to update your component when url was changed.
    if (nextProps.params.worksCategoryKey !== this.props.params.worksCategoryKey) {
      if (nextProps.params.worksCategoryKey) {
        nextProps.workActions.loadWorks(nextProps.params.worksCategoryKey);
      }
    }

    if (nextProps.params.peopleCategoryKey !== this.props.params.peopleCategoryKey) {
      if (nextProps.params.peopleCategoryKey) {
        nextProps.personActions.loadPeople(nextProps.params.peopleCategoryKey);
      }
    }

    // 作家別作品一覧
    if (nextProps.params.personId !== this.props.params.personId) {
      if (nextProps.params.personId) {
        nextProps.workActions.loadWorks(null, nextProps.params.personId);
      }
    }

    // 単一作品表示
    // component新規ロードではなく更新の際には必要なデータはすでに読み込まれている
    // はずなので、ロード不要

    // お気に入り一覧
    if (!this.props.routes.find(r => r.path === '/favorites')) {
      if (nextProps.routes.find(r => r.path === '/favorites')) {
        if (nextProps.auth.user.id) {
          nextProps.favoriteActions.loadFavorites(nextProps.auth);
        }
      }
    }

    // Favoritesは保持された状態なので、読みなおす必要はない

    // if (nextProps.params.favoriteId !== this.props.params.favoriteId) {
    //   if (nextProps.params.favoriteId) {
    //     if (nextProps.auth.user.id) {
    //       nextProps.loadFavorites(nextProps.auth);
    //     }
    //   }
    // }
  }

  render() {
    const {
      works, people, favorites, auth, menu
    } = this.props;

    // 表示すべきデータが無い場合はスキップ
    if (works === null && people === null && favorites === null) {
      return null;
    }

    const workId = Number(this.props.params.workId);
    const personId = Number(this.props.params.personId);
    const favoriteId = this.props.params.favoriteId;

    // queryから取得する場合
    // const categoryKey = this.props.params.location.query.category;
    const worksCategoryKey = this.props.params.worksCategoryKey;
    const worksRowKey = this.props.params.worksRowKey;

    let work;
    if (workId) {
      work = this.getWork(works.data, workId, favorites.data);

    } else if (favoriteId) {
      // TODO 読み込みリクエスト投げたのにisFetchingがfalseになるタイミングがある
      if (favorites.isFetching) {
        console.warn("favorites is fetching");
        return <Loading />;
      }

      // お気に入りIDが渡されたらその情報を元にworkを組み立てる
      let favorite = favorites.data.find(f => f.favoriteId === favoriteId);

      // お気に入りが取れないのは想定外
      // TODO 上のガード句をすり抜けるので、ここまで来るケースがある。その後favoritesが取れるようになるので、最終的には取得できるが…
      // TODO 上記、そういうものだと受け入れて、それ前提でロジック書く必要ありそう
      if (!favorite) {
        console.error("favorite is empty");
        return null;
      }

      work = Object.assign({}, favorite._work, { favorite });
    }

    const peopleCategoryKey = this.props.params.peopleCategoryKey;
    const peopleRowKey = this.props.params.peopleRowKey;

    const searchPerson = this.props.location.query.searchPerson == 'true';

    // TODO 実装見直し
    let navigationType = null;
    if (this.props.routes.find(r => r.path === '/people')) {
      navigationType = navigationTypes.BY_PERSON;
    } else if (this.props.routes.find(r => r.path === '/works')) {
      navigationType = navigationTypes.BY_WORK;
    } else if (this.props.routes.find(r => r.path === '/favorites')) {
      navigationType = navigationTypes.BY_FAVORITE;
    } else if (this.props.routes.find(r => r.path === '/search')) {
      navigationType = navigationTypes.BY_SEARCH_RESULT;
    }

    // worksCategoryKey, worksRowKeyが取れる場合、routesが無い
    // worksCategoryKey == undefinedの場合もある
    if (worksCategoryKey) {
      navigationType = navigationTypes.BY_WORK;
    }

    if (worksRowKey) {
      navigationType = navigationTypes.BY_WORK;
    }

    if (peopleCategoryKey) {
      navigationType = navigationTypes.BY_PERSON;
    }

    if (peopleRowKey) {
      navigationType = navigationTypes.BY_PERSON;
    }

    // 作家が特定されたら作家に該当する作品一覧を表示
    if (personId) {
      navigationType = navigationTypes.BY_WORK;
    }

    // contentはContentViewが扱う汎用的なデータ
    const content = {type: navigationType, data: work};

    // TODO NavigationのselectedWorkIdをここで指定しない。Navigationに依存しないように
    // TODO ただし、Navigationではparamsが取れない(routesに出てこないので)
    // TODO contentTypesを渡すのではなく、workの型から自動判別させるべき

    // TODO メニューパラメータ見直し
    return (
      <div className={styles.base}>

        <SideMenu
          {...this.props}
          navigationType={navigationType}
          selectedWorkId={workId}
          worksCategoryKey={worksCategoryKey}
          worksRowKey={worksRowKey}
          selectedPersonId={personId}
          peopleCategoryKey={peopleCategoryKey}
          peopleRowKey={peopleRowKey}
          searchPerson={searchPerson}
        />

        <div className={styles.main} role="form">
          {this.props.children
            ? React.cloneElement(this.props.children,
              {content: content})
            : null
          }
        </div>
      </div>
    );
  }

  getWork(data: Array<Work>, workId: number, favorites: Array<Favorite>) {
    let work = data.find(w => w.workId === workId)

    if (!work) {
      return null;
    }

    // お気に入りに入っているかどうかを調べて、その状態で更新する
    // console.log(favorites);
    const favorite = favorites.find(f => (workId === f.workId));

    // console.log(favorite);

    work = Object.assign({}, work, { favorite });

    return work;
  }
}

export default Dashboard;