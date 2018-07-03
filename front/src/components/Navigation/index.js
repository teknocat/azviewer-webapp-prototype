// @flow

import React from 'react';
import PropTypes from 'prop-types';
import * as navigationTypes from '../../constants/navigationTypes';
import WorkList from '../../containers/WorkList/index'
import PersonList from '../../containers/PersonList/index'
import FavoriteList from '../../containers/FavoriteList/index'
import SearchList from '../../containers/SearchList/index'
import Loading from '../../components/Loading';

class Navigation extends React.Component {
  props: {
    works: Array<Work>;
    people: Array<Person>;
    favorites: Array<Favorite>;
    selectedWorkId: number;
    selectedPersonId: number;
    worksCategoryKey: string;
    worksRowKey: string;
    worksFetching: boolean;
    peopleCategoryKey: string;
    peopleRowKey: string;
    peopleFetching: boolean;
    favoritesFetching: boolean;
    // TODO enum化してDRYに
    // https://github.com/facebook/flow/issues/627#issuecomment-222290748
    // 上は、$Valuesの方が適切らしい
    // https://gist.github.com/hejrobin/6e869684f5e493681d7e171d818b8802
    // navigationType: "BY_PERSON" | "BY_WORK" | "BY_FAVORITE"
    // TODO 上記動作しない
    navigationType: any;
    searchPerson: boolean;
  };

  render() {
    const {
      works = [], people = [], favorites = [],
      selectedWorkId, selectedPersonId,
      worksCategoryKey,
      worksRowKey,
      worksFetching,
      peopleCategoryKey,
      peopleRowKey,
      peopleFetching,
      favoritesFetching,
      navigationType,
      searchPerson
    } = this.props;

    if (navigationType === navigationTypes.BY_PERSON) {
      return (
        <div>
          <PersonList
            people={people}
            selectedPersonId={selectedPersonId}
            peopleCategoryKey={peopleCategoryKey}
            peopleRowKey={peopleRowKey}
            peopleFetching={peopleFetching}
          />
      </div>
      );
    } else if (navigationType === navigationTypes.BY_WORK) {
      return (
        <div>
          <WorkList
            works={works}
            selectedWorkId={selectedWorkId}
            selectedPersonId={selectedPersonId}
            worksCategoryKey={worksCategoryKey}
            worksRowKey={worksRowKey}
            worksFetching={worksFetching}
          />
        </div>
      );
    } else if (navigationType === navigationTypes.BY_FAVORITE) {
      return (
        <div>
          <FavoriteList favorites={favorites} favoritesFetching={favoritesFetching} />
        </div>
      )
    } else if (navigationType === navigationTypes.BY_SEARCH_RESULT) {
      return (
        <div>
          <SearchList
            works={works}
            worksFetching={worksFetching}
            people={people}
            peopleFetching={peopleFetching}
            searchPerson={searchPerson}
          />
        </div>
      );
    } else {
      return null;
    }

  }

}

Navigation.propTypes = {
  works: PropTypes.array,
  people: PropTypes.array,
  selectedWorkId: PropTypes.number,
  selectedPersonId: PropTypes.number,
  navigationType: PropTypes.string,
};

export default Navigation;