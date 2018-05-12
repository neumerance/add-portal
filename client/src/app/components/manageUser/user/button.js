import React from 'react';
import { Modal }   from 'react-bootstrap';
import * as _ from 'lodash';
import ManageUserModal from './modal';

export default class ManageUserButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    }
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal })
  }

  render() {
    return(
      <div>
        <button className="btn btn-xs btn-info" onClick={this.toggleModal.bind(this)}>
          <i className="fa fa-plus"></i> Add user
        </button>
        <ManageUserModal socket={this.props.socket}
                         toggleModal={this.toggleModal.bind(this)}
                         showModal={this.state.showModal} />
      </div>
    );
  }

}
