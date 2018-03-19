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

const MainRoutes = (socket) => {
  return (
    <Switch>
      <PrivateRoute exact path="/" socket={socket} component={Home} />
      <PrivateRoute path="/about" socket={socket} component={About} />
      {/* private views: need user to be authenticated */}
      <PrivateRoute path="/protected" component={Protected} />
    </Switch>
  );
};

export default MainRoutes;
