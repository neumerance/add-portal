import React from 'react';
import { Modal }   from 'react-bootstrap';
import * as _ from 'lodash';
import ManageUserButton from './user/button';

export default class ManageUserCreateModal extends React.Component {

  render() {
    return(
      <ManageUserButton socket={this.props.socket} />
    );
  }

}
