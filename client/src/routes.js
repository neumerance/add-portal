import React from 'react';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import Login from './views/login';
import ChannelSelection from './views/channel_selection';

export default class MainRoutes extends React.Component {

  render() {
    return(
      <Router history={hashHistory}>
        <Route exact path="/" component={ Login } />
        <Route exact path="/channel-selection" component={ ChannelSelection } />
      </Router> 
    );
  }

}