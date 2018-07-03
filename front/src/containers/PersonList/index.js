// @flow

import React from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as personActions from '../../actions/person';
import styles from './styles.css';
import renderHelper from '../../utils/renderHelper'
import Loading from '../../components/Loading';

class PersonList extends React.Component {
  props: {
    people: Array<Person>;
    peopleCategoryKey: string;
    peopleRowKey: string;
    peopleFetching: boolean;
    page: number;
    personActions: bindActionCreators;
  };

  loadMoreItems() {
    const {
      peopleCategoryKey, page,
    } = this.props;

    this.props.personActions.loadMorePeople(peopleCategoryKey, page);
  }

  renderItem(person, selectedPersonId) {
    const classNames = ['PersonList-item'];

    // 選択中の要素に`is-selected`classを付与する
    if (Number(selectedPersonId) === person.personId) {
      classNames.push('is-selected');
    }

    return <li className={classNames.join(' ')} key={person.personId}>
      <Link to={`/people/${person.personId}`}>
        <span className="PersonList-title">
          {person.familyName} {person.givenName}
        </span>
      </Link>
    </li>;
  }

  renderRowItem(key, name) {
    return <li className="PersonList-item" key={key}>
      <Link to={`/people/category/row/${key}`}>
        <span className="PersonList-title">
          {name}
        </span>
      </Link>
    </li>;
  }

  renderColumnItem(key, name) {
    return <li className="PersonList-item" key={key}>
      <Link to={`/people/category/${key}`}>
        <span className="PersonList-title">
          {name}
        </span>
      </Link>
    </li>;
  }

  render() {
    const {
      people = [],
      peopleRowKey,
      peopleCategoryKey,
      peopleFetching
    } = this.props;

    let items;

    if (peopleCategoryKey) {
      items = people.map((person) => {
        return this.renderItem(person, null);
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

      items.push(peopleFetching &&
        <Loading key="loading"/>
      );

    } else if (peopleRowKey) {
      items = renderHelper.renderColumnItems(this.renderColumnItem, peopleRowKey);

    } else {
      items = renderHelper.renderRowItems(this.renderRowItem);
    }

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
    personActions: bindActionCreators(personActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonList);;