// @flow

import React from 'react';
import { connect } from 'react-redux';
import { PageHeader, Form, FormGroup, FormControl, Grid, Col, Row, Checkbox, Button, ControlLabel } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import * as authActions from '../../actions/auth';
import Loading from '../../components/Loading';

type Props = {
  auth: Auth;
  authActions: bindActionCreators;
}
type State = void;

class Login extends React.Component<void, Props, State> {
  handleSubmit(e) {
    const target = e.target;

    e.preventDefault();

    this.props.authActions.loginUser(
      target.userName.value.trim(),
      target.password.value.trim(),
      '/login'
    );
  }

  renderSubmit() {
    return this.props.auth.isFetching ? <Loading /> : <input type="submit" value="Log in" />;
  }

  render() {
    const { auth } = this.props;

    return (
      <Grid>
        <PageHeader>Log in</PageHeader>

        <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
          <FormGroup controlId="userName">
            <Col componentClass={ControlLabel} sm={2}>
              User Name
            </Col>
            <Col sm={10}>
              <FormControl type="text" placeholder="User Name" />
            </Col>
          </FormGroup>

          <FormGroup controlId="password">
            <Col componentClass={ControlLabel} sm={2}>
              Password
            </Col>
            <Col sm={10}>
              <FormControl type="password" placeholder="Password" />
            </Col>
          </FormGroup>

          {/*<FormGroup>*/}
            {/*<Col smOffset={2} sm={10}>*/}
              {/*<Checkbox>Remember me</Checkbox>*/}
            {/*</Col>*/}
          {/*</FormGroup>*/}

          {auth.error &&
            <FormGroup>
              {auth.error}
            </FormGroup>
          }

          <FormGroup>
            <Col smOffset={2} sm={10}>
              {this.renderSubmit()}
            </Col>
          </FormGroup>
        </Form>
      </Grid>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

function mapDispatchToProps(dispatch) {
  return {
    authActions: bindActionCreators(authActions, dispatch),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Login);