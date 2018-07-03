// @flow

import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as favoriteActions from '../../actions/favorite';
import styles from './styles.css';
import Loading from '../../components/Loading';

class FavoriteList extends React.Component {
  props: {
    favorites: Array<Favorite>;
    favoritesFetching: boolean;
    auth: Auth;
    page: number;
    favoriteActions: bindActionCreators;
  };

  loadMoreItems() {
    const {
      auth, page,
    } = this.props;

    this.props.favoriteActions.loadMoreFavorites(auth, page);
  }

  renderItem(favorite: Favorite) {
    // TODO ガード句が冗長なのでなんとかしたい "This type cannot be coerced to string" in template literals · Issue #2814 · facebook/flow - https://github.com/facebook/flow/issues/2814
    if (!favorite || favorite.favoriteId == null) {
      console.error("favorite is null");
      return;
    }

    const work = favorite._work;
    if (!work) {
      console.error("work is null");
      return;
    }

    const classNames = ['FavoriteList-item'];

    return <li className={classNames.join(' ')} key={favorite.favoriteId}>
      <Link to={`/favorites/${favorite.favoriteId}`}>
        <span className="FavoriteList-title">
          {work.title} ({work._person.familyName} {work._person.givenName})
        </span>
      </Link>
    </li>;
  }

  render() {
    const {
      favorites = [],
      favoritesFetching,
    } = this.props;

    let items;

    items = favorites.map((favorite) => {
      return this.renderItem(favorite);
    });

    if (favoritesFetching) {
      items.push(
        <li key="bottom" className={styles.loading}>
            <span>
              <p></p>
            </span>
        </li>
      );
    } else {
      items.push(
        <li key="bottom" className={styles.moreItems}>
            <span onClick={() => this.loadMoreItems()}>
              ▼
            </span>
        </li>
      );
    }

    items.push(favoritesFetching &&
      <Loading key="loading"/>
    );

    return <div className={styles.base}>
      <ul>{items}</ul>
    </div>;
  }
}

function mapStateToProps({auth, page}, ownProps) {
  return {auth, page}
}

function mapDispatchToProps(dispatch) {
  return {
    favoriteActions: bindActionCreators(favoriteActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FavoriteList);