// @flow

import React from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as workActions from '../../actions/work';
import * as personActions from '../../actions/person';
import styles from './styles.css';
import renderHelper from '../../utils/renderHelper'
import Loading from '../../components/Loading';

class SearchList extends React.Component {
  props: {
    works: Array<Work>;
    worksFetching: boolean;
    people: Array<Person>;
    peopleFetching: boolean;
    searchPerson: boolean;
    page: number;
    workActions: bindActionCreators;
    personActions: bindActionCreators;
  };

  loadMoreItems() {
    // const {
    //   selectedPersonId, worksCategoryKey, page,
    // } = this.props;
    //
    // this.props.workActions.loadMoreWorks(worksCategoryKey, selectedPersonId, page);
  }

  renderWorkItem(work, selectedWorkId) {
    let classNames = ['WorkList-item'];

    return <li className={classNames.join(' ')} key={work.workId}>
      <Link to={`/works/${work.workId}`}>
        <span className="WorkList-title">
          {work.title} ({work._person.familyName} {work._person.givenName})
        </span>
      </Link>
    </li>;
  }

  renderPersonItem(person, selectedPersonId) {
    const classNames = ['PersonList-item'];

    return <li className={classNames.join(' ')} key={person.personId}>
      <Link to={`/people/${person.personId}`}>
        <span className="PersonList-title">
          {person.familyName} {person.givenName}
        </span>
      </Link>
    </li>;
  }


  // TODO 検索結果と通常のリストは実装同じなのでまとめる

  render() {
    const {
      works = [],
      worksFetching,
      people = [],
      peopleFetching,
      searchPerson
    } = this.props;

    let items;

    if (searchPerson) {
      items = people.map((person) => {
        return this.renderPersonItem(person, null);
      });

      if (peopleFetching) {
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

    } else {
      items = works.map((work) => {
        return this.renderWorkItem(work, null);
      });

      if (worksFetching) {
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
    }

    items.push((worksFetching || peopleFetching) &&
      <Loading key="loading"/>
    );


    return <div className={styles.base}>
      <ul>{items}</ul>
    </div>;
  }

}

function mapStateToProps({page}, ownProps) {
  return {page}
}

function mapDispatchToProps(dispatch) {
  return {
    workActions: bindActionCreators(workActions, dispatch),
    personActions: bindActionCreators(personActions, dispatch),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(SearchList);