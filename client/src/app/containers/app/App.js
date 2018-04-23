// @flow weak

import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { NavigationBar, BackToTop } from '../../components';
import socket from 'socket.io-client';
import navigationModel from '../../config/navigation.json';
import MainRoutes from '../../routes/MainRoutes';
import { appConfig } from '../../config/appConfig';
import styles from './app.scss';
import auth from '../../services/auth'

class App extends Component {
  state = { navModel: navigationModel };

  constructor(props) {
    super(props);
    this.socket = socket.connect(appConfig.serverHost, { query: { token: auth.getToken() } });
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
