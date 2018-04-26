// @flow

// #region imports
import React, {
  PureComponent
}                         from 'react';
import PropTypes          from 'prop-types';
import axios              from 'axios';
import {
  Row,
  Col,
  Button
}                         from 'react-bootstrap';
import styles             from '../home/home.scss';
import auth               from '../../services/auth';
import appConfig          from '../../../../config';
import getLocationOrigin  from '../../services/utils/getLocationOrigin';
import userInfoMock       from '../../mock/userInfo.json';
// #endregion

// #region flow types
type Props = {
  // react-router 4:
  match: any,
  location: any,
  history: any,

};

type State = {
  email: string,
  password: string,
  isLogging: boolean
};
// #endregion

class Login extends PureComponent<Props, State> {
  static propTypes= {
    // react-router 4:
    match:    PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history:  PropTypes.object.isRequired
  };

  state = {
    email:      '',
    password:   '',
    isLogging:  false
  };

  componentDidMount() {
    this.disconnectUser(); // diconnect user: remove token and user info
  }

  render() {
    const {
      email,
      password,
      isLogging
    } = this.state;

    return (
      <div className="m-t-10-percent">
        <Row>
          <Col md={4} mdOffset={4} xs={10} xsOffset={1}>
          <div className={`${styles.ch}`}>
              <div className={styles.chIcon}><i className="fa fa-user"></i></div>
                <div className={styles.chContent}>
                  <input type="text"
                          className={`form-control ${styles.chInput}`}
                          id="inputEmail"
                          placeholder="Email"
                          value={email}
                          onChange={this.handlesOnEmailChange}
                        />
                </div>
              </div>
              <div className={`${styles.ch} m-t-4`}>
                <div className={styles.chIcon}><i className="fa fa-key"></i></div>
                <div className={styles.chContent}>
                  <input
                        type="password"
                        className={`form-control ${styles.chInput}`}
                        id="inputPassword"
                        placeholder="Password"
                        value={password}
                        onChange={this.handlesOnPasswordChange}
                      />
                </div>
              </div>
              <div className="m-t-4">
                <Button
                  className="btn btn-info btn-sm btn-block"
                  bsStyle="primary"
                  disabled={isLogging}
                  onClick={this.handlesOnLogin}>
                  {
                    isLogging
                      ?
                      <span>
                        login in...
                        &nbsp;
                        <i
                          className="fa fa-spinner fa-pulse fa-fw"
                        />
                      </span>
                      :
                      <span>
                        Login
                      </span>
                  }
                </Button>
              </div>
          </Col>
        </Row>
      </div>
    );
  }

  disconnectUser = () => {
    auth.clearAllAppStorage();
  }

  handlesOnEmailChange = (
    event: SyntheticEvent<>
  ) => {
    event.preventDefault();
    // should add some validator before setState in real use cases
    this.setState({ email: event.target.value.trim() });
  }

  handlesOnPasswordChange = (
    event: SyntheticEvent<>
  ) => {
    event.preventDefault();
    // should add some validator before setState in real use cases
    this.setState({ password: event.target.value.trim() });
  }

  handlesOnLogin = async (
    event: SyntheticEvent<>
  ) => {
    if (event) {
      event.preventDefault();
    }

    const {
      history
    } = this.props;

    const {
      email,
      password
    } = this.state;

    const userLogin = {
      email:    email,
      password: password
    };

    try {
      this.setState({ isLogging: true });
      const response = await this.logUser(userLogin);
      const {
        data: {
          token,
          user
        }
      } = response;

      auth.setToken(token);
      auth.setUserInfo(user);
      this.setState({ isLogging: false });

      history.push({ pathname: '/' }); // back to Home
    } catch (error) {
      this.setState({ isLogging: false });
      /* eslint-disable no-console */
      console.log('login went wrong..., error: ', error);
      /* eslint-enable no-console */
    }
  }

  logUser = async (userLogin) => {
    const __SOME_LOGIN_API__ = 'api/authenticate';
    const url         = `${appConfig.addServerHost}/${__SOME_LOGIN_API__}`;
    const method      = 'post';
    const headers     = {};
    try {
      const response = await axios.request({
        method,
        url,
        data: userLogin
      });

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  goHome = (event: any) => {
    if (event) {
      event.preventDefault();
    }
    const {
      history
    } = this.props;
    history.push({ pathname: '/' });
  }
}

export default Login;
