// @flow

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { Button, Glyphicon } from 'react-bootstrap';
import * as menuActions from '../../actions/menu';
import Navigation from '../../components/Navigation/index';
import styles from './styles.css';
import config from '../../config';

class SideMenu extends React.Component {
  props: {
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
    selectedWorkId: number;
    selectedPersonId: number;
    worksCategoryKey: string;
    worksRowKey: string;
    peopleCategoryKey: string;
    peopleRowKey: string;
    // TODO enum化してDRYに
    // https://github.com/facebook/flow/issues/627#issuecomment-222290748
    // 上は、$Valuesの方が適切らしい
    // https://gist.github.com/hejrobin/6e869684f5e493681d7e171d818b8802
    // navigationType: "BY_PERSON" | "BY_WORK" | "BY_FAVORITE"
    // TODO 上記動作しない
    navigationType: any;
    searchPerson: boolean;

    menu: any;
    auth: any;

    menuActions: bindActionCreators;
  };

  handleClickMenu(isOpened) {
    this.props.menuActions.operateMenu(!isOpened);
  }

  render() {
    const {
      works, people, favorites,
      selectedWorkId, selectedPersonId,
      worksCategoryKey,
      worksRowKey,
      peopleCategoryKey,
      peopleRowKey,
      navigationType,
      searchPerson,

      menu,
      auth,
    } = this.props;

    return (
      <div className={styles.sideMenu}>
        <div className={styles.menuButton}>
          <Button onClick={() => this.handleClickMenu(menu.isOpened)}>
            {menu.isOpened
              ? <Glyphicon glyph="chevron-left" />
              : <Glyphicon glyph="chevron-right" />
            }
          </Button>
        </div>
        <div className={menu.isOpened ? styles.list : styles.list + " " + styles.sideMenuClosed  }>
          <div className={styles.listHeader}>
            <div className={styles.filterType}>
              <ul>
                <li className={navigationType === 'BY_PERSON' ? styles.isSelected : null}>
                  <Link to={`/people/`}>作家別</Link>
                </li>
                <li className={navigationType === 'BY_WORK' ? styles.isSelected : null}>
                  <Link to={`/works/`}>作品別</Link>
                </li>
                {config[process.env.NODE_ENV].login && auth.isLoggedIn &&
                <li className={navigationType === 'BY_FAVORITE' ? styles.isSelected : null}>
                  <Link to={`/favorites/`}>お気に入り</Link>
                </li>
                }
                {config[process.env.NODE_ENV].bookmark && auth.isLoggedIn &&
                <li>
                  <a href="#">しおり</a>
                </li>
                }
              </ul>
            </div>
          </div>
          <div role="navigation" className={styles.navigation}>
            <Navigation
              navigationType={navigationType}
              works={works.data} selectedWorkId={selectedWorkId}
              worksCategoryKey={worksCategoryKey}
              worksRowKey={worksRowKey}
              worksFetching={works.isFetching}
              people={people.data} selectedPersonId={selectedPersonId}
              peopleCategoryKey={peopleCategoryKey}
              peopleRowKey={peopleRowKey}
              peopleFetching={people.isFetching}
              favorites={favorites.data}
              favoritesFetching={favorites.isFetching}
              searchPerson={searchPerson}
            />
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    menuActions: bindActionCreators(menuActions, dispatch),
  }
}

export default connect(null, mapDispatchToProps)(SideMenu)
