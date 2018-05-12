import React from 'react';
import { Modal }   from 'react-bootstrap';
import * as _ from 'lodash';
import ManageUserModal from './user/modal';

export default class ManageUserUpdateModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: null
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      this.setState({ user: nextProps.user });
    }
  }

  render() {
    return(
      <ManageUserModal socket={this.props.socket}
                       user={this.state.user}
                       showModal={this.props.showModal}
                       toggleModal={this.props.toggleModal.bind(this)} />
    );
  }

}
