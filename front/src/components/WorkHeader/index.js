import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import StarButton from '../StarButton/StarButton';
import Button from '../Button';
import styles from './styles.css';
import config from "../../config";

class WorkHeader extends React.Component {

  clickNewWindow(work: Work) {
    window.open(work.xmlUrl, null);
  }

  render() {
    const { work, auth, favorite } = this.props;
    const starred = !!favorite;

    return <div className={styles.base}>
      <h1 className={styles.title}>
        {work.title}
      </h1>
      <div className={styles.meta}>
        <span className={styles.author}>
          <span className="glyphicon glyphicon-user" aria-hidden="true"></span>
          &nbsp;{work._person.familyName} {work._person.givenName}
        </span>
      </div>
      <div className={styles.buttons}>
        {config[process.env.NODE_ENV].login && auth.isLoggedIn &&
          <StarButton starred={starred} onChange={this.props.onChangeStar}/>
        }
        <Button onClick={() => this.clickNewWindow(work)}>
          <span className="glyphicon glyphicon-new-window" aria-hidden="true"></span>
        </Button>
      </div>
    </div>;
  }

}

WorkHeader.propTypes = {
  work: PropTypes.object,
}

export default WorkHeader;