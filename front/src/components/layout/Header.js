// @flow
// jwt-react-redux-auth-example 参照

import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import { connect } from 'react-redux';
import { Button, Navbar, Form, FormGroup, FormControl, Checkbox } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import config from '../../config';

class Header extends Component {
  props: {
    auth: Auth;
    menu: Menu;
    routes: any;
    handleLogout: () => void;
    handleSearch: () => void;
  };

  render() {
    const { auth, menu, handleLogout, handleSearch, routes } = this.props;

    return (
      <header>
        <Navbar fluid>
          <Navbar.Header>
            <Navbar.Brand>
              <IndexLink to="/" activeClassName="active">
                azviewer (webapp ver.)
              </IndexLink>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            {
              config[process.env.NODE_ENV].login &&
                this.renderAuthInfo(auth, handleLogout)
            }
            <Navbar.Form pullLeft>
              <Form onSubmit={handleSearch}>
                <FormGroup>
                  <FormControl id="searchText" type="text" placeholder="Search"/>
                </FormGroup>
                {' '}
                <Checkbox id="searchPerson">
                  作家名を検索
                </Checkbox>
                </Form>
            </Navbar.Form>
          </Navbar.Collapse>
        </Navbar>
      </header>
    );
  }

  renderAuthInfo(auth: Auth, handleLogout: Function)  {
    if (auth.isLoggedIn) {
      return this.renderLoggedIn(auth, handleLogout);
    } else {
      return this.renderNotLoggedIn()
    }
  }

  renderLoggedIn(auth: Auth, handleLogout: Function) {
    return (
      <Navbar.Text>
        ユーザ名：<span>{auth.user.name}</span>
        {' '}
        <Button onClick={handleLogout}>ログアウト</Button>
      </Navbar.Text>
    );
  }

  renderNotLoggedIn() {
    if (this.props.routes.find(r => r.path === '/login')) {
      return null;
    }
    return (
      <Navbar.Text>
        <LinkContainer to="/login">
          <Button>ログイン</Button>
        </LinkContainer>
      </Navbar.Text>
    );
  }
}

export default Header;
