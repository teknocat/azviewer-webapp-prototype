// @flow

import React from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as workActions from '../../actions/work';
import styles from './styles.css';
import renderHelper from '../../utils/renderHelper'
import Loading from '../../components/Loading';

class WorkList extends React.Component {
  props: {
    works: Array<Work>;
    selectedWorkId: number;
    selectedPersonId: number;
    worksCategoryKey: string;
    worksRowKey: string;
    worksFetching: boolean;
    page: number;
    workActions: bindActionCreators;
  };

  loadMoreItems() {
    const {
      selectedPersonId, worksCategoryKey, page,
    } = this.props;

    this.props.workActions.loadMoreWorks(worksCategoryKey, selectedPersonId, page);
  }

  renderItem(work, selectedWorkId) {
    let classNames = ['WorkList-item'];

    if (Number(this.props.selectedWorkId) === work.workId) {
      classNames.push(styles.isSelected);
    }

    return <li className={classNames.join(' ')} key={work.workId}>
      <Link to={`/works/${work.workId}`}>
        <span className="WorkList-title">
          {work.title} ({work._person.familyName} {work._person.givenName})
        </span>
      </Link>
    </li>;
  }

  renderRowItem(key, name) {
    return <li className="WorkList-item" key={key}>
      <Link to={`/works/category/row/${key}`}>
        <span className="WorkList-title">
          {name}
        </span>
      </Link>
    </li>;
  }

  renderColumnItem(key, name) {
    return <li className="WorkList-item" key={key}>
      <Link to={`/works/category/${key}`}>
        <span className="WorkList-title">
          {name}
        </span>
      </Link>
    </li>;
  }

  render() {
    const {
      works = [], selectedWorkId, selectedPersonId,
      worksCategoryKey,
      worksRowKey,
      worksFetching,
    } = this.props;

    let items;

    // TODO 実装整理
    if (worksCategoryKey || selectedPersonId) {
      // 作品一覧(頭文字別)
      // 作品一覧(作家別)
      items = works.map((work) => {
        return this.renderItem(work, null);
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

      items.push(worksFetching &&
        <Loading key="loading"/>
      );

    } else if (worksRowKey) {
      items = renderHelper.renderColumnItems(this.renderColumnItem, worksRowKey);

    } else if (selectedWorkId) {
      // 特定一つの作品を表示
      items = works.map((work) => {
        return this.renderItem(work, selectedWorkId);
      });
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
    workActions: bindActionCreators(workActions, dispatch),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(WorkList);