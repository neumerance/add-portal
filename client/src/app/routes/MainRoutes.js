// @flow weak

import React        from 'react';
import {
  Route,
  Switch
}                   from 'react-router';
import Home         from '../views/home/Home';
import About        from '../views/about/About';
import Protected    from '../views/protected/Protected';
import PrivateRoute from '../components/privateRoute/PrivateRoute';
import ConferenceMainScreen from '../views/conference/index';
import ManageUser   from '../views/manageUser/manageUser';

const MainRoutes = (socket) => {
  return (
    <Switch>
      <PrivateRoute exact path="/" socket={socket} component={Home} />
      <PrivateRoute path="/about" socket={socket} component={About} />
      <PrivateRoute path="/conference/:token" socket={socket} component={ConferenceMainScreen} />
      <PrivateRoute path="/manage-user" socket={socket} component={ManageUser} />
      <PrivateRoute path="/protected" component={Protected} />
    </Switch>
  );
};

export default MainRoutes;
