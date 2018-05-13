// @flow weak

import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { NavigationBar, BackToTop } from '../../components';
import socket from 'socket.io-client';
import navigationModel from '../../config/navigation.json';
import MainRoutes from '../../routes/MainRoutes';
import appConfig from '../../../../config';
import styles from './app.scss';
import auth from '../../services/auth'
import NotificationSystem  from 'react-notification-system';


class App extends Component {
  state = { navModel: navigationModel };

  constructor(props) {
    super(props);
    this.socket = socket.connect(appConfig.addServerHost, { query: { token: auth.getToken() }, secure: true });
    this._notificationSystem = null
  }

  componentDidMount() {
    this._notificationSystem = this.refs.notificationSystem;
    this.socket.on('success#message', (resp) => {
      this._notificationSystem.addNotification({
        message: resp,
        level: 'success'
      });
    });
    this.socket.on('error#message', (resp) => {
      this._notificationSystem.addNotification({
        message: resp,
        level: 'error'
      });
    });
  }

  render() {
    const { navModel } = this.state;

    return (
      <div id="appContainer">
        <div className="container-fluid">
          <MainRoutes socket={this.socket} />
        </div>
        <BackToTop
          minScrollY={40}
          scrollTo={'appContainer'}
        />
        <NotificationSystem ref="notificationSystem" />
      </div>
    );
  }

  /* eslint-disable no-unused-vars*/
  handleLeftNavItemClick = (event, viewName) => {
    // something to do here?
  }

  handleRightNavItemClick = (event, viewName) => {
    // something to do here?
  }
  /* eslint-enable no-unused-vars*/
}

export default withRouter(App);
