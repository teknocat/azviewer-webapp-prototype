// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from '../../actions/auth';
import * as workActions from '../../actions/work';

import Header from '../../components/layout/Header';
import Loading from '../../components/Loading';

type Props = {
  auth: Auth;
  menu: Menu;
  children?: Element<any>;
  routes: Array<Object>;
  authActions: bindActionCreators;
  workActions: bindActionCreators;
  router: any;
}

type State = void

// JSON Web Tokenを使ってReactとReduxのSPAでログイン認証をする - Qiita
// http://qiita.com/nabeliwo/items/ac4b77324a9989e8e6bb#localstorage%E3%81%8B%E3%82%89%E5%8F%96%E3%82%8A%E5%87%BA%E3%81%97%E3%81%9F%E3%83%88%E3%83%BC%E3%82%AF%E3%83%B3%E3%82%92%E3%83%AA%E3%82%AF%E3%82%A8%E3%82%B9%E3%83%88%E3%83%98%E3%83%83%E3%83%80%E3%83%BC%E3%81%AB%E4%B9%97%E3%81%9B%E3%81%A6get%E3%83%AA%E3%82%AF%E3%82%A8%E3%82%B9%E3%83%88%E3%82%92%E9%80%81%E4%BF%A1
class App extends React.Component<void, Props, State> {
  handleLogout() {
    this.props.authActions.logout();
  }

  // handleSearch(e: any) {
  //   const target = e.target;
  //   if(e.charCode === 13){
  //     // this.props.workActions.searchWorks(target.value);
  //     // console.dir(this.props);
  //     // this.props.router.replace('/search');
  //     console.dir(target.value);
  //     this.props.router.push({pathname: '/search', query: {q: target.value}});
  //   }
  // }

  handleSearch(e: any) {
    e.preventDefault();

    const target = e.target;
    const searchText = target.searchText.value;
    const searchPerson = target.searchPerson.checked;
    // console.log(searchText);
    // console.log(searchPerson);
    this.props.router.push({pathname: '/search', query: {q: searchText, searchPerson: searchPerson}});
  }

  render() {
    const { auth, menu, children, routes } = this.props;

    return (
      <div>
        <Header
          auth={auth}
          menu={menu}
          handleLogout={this.handleLogout.bind(this)}
          handleSearch={this.handleSearch.bind(this)}
          routes={routes}
        />
        {children}
      </div>
    );
  }
}

function mapStateToProps({auth, menu}) {
  return {auth, menu};
}

function mapDispatchToProps(dispatch) {
  return {
    authActions: bindActionCreators(authActions, dispatch),
    workActions: bindActionCreators(workActions, dispatch),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(App);