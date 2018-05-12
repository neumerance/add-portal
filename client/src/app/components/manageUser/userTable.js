import React from 'react';
import { Table }   from 'react-bootstrap';
import ManageUserUpdateModal from './updateUserModal';
import Confirm  from 'react-confirm-bootstrap';
import * as _ from 'lodash';

const ROLES = ['', 'Admin', 'AddPro', 'Viewer'];

export default class ManageUserTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      selectedUser: null,
      showUpdateModal: false
    }
  }

  componentDidMount() {
    this.props.socket.socket.emit('admin#ask::user#lists');
    this.props.socket.socket.on('user#lists', (resp) => {
      this.setState({ users: resp });
    });
    this.props.socket.socket.on('broadcast::user#lists', (resp) => {
      this.setState({ users: resp });
    });
  }

  toggleUpdateModal() {
    this.setState({ showUpdateModal: !this.state.showUpdateModal }, () => {
      if(!this.state.showUpdateModal) {
        this.setState({ selectedUser: null });
      }
    });
  }

  setSelectedUser(selectedUser) {
    this.setState({ selectedUser }, () => {
      if (this.state.selectedUser) {
        this.toggleUpdateModal();
      }
    });
  }

  confirmUserDelete(params) {
    this.props.socket.socket.emit('admin#ask::user#destroy', params);
  }

  renderRows() {
    return this.state.users.map((user, key) => {
      return(
        <tr key={`userTable-${key}`}>
          <td>{user.id}</td>
          <td>{ROLES[user.role]}</td>
          <td>{user.email}</td>
          <td>{user.firstname}</td>
          <td>{user.lastname}</td>
          <td>{_.get(user, 'userLocal.local')}</td>
          <td>{_.get(user, 'userLocal.district')}</td>
          <td>
            <button className="btn btn-xs btn-info" onClick={() => { this.setSelectedUser(user) }}>
              <i className="fa fa-pencil"></i>
            </button>
            <Confirm onConfirm={() => { this.confirmUserDelete(user) }}
                     body="Are you sure you want to delete this user?"
                     confirmText="Confirm Delete"
                     title={`Deleting ${user.email}`}>
                    <button className="btn btn-xs btn-default">
                      <i className="fa fa-trash"></i>
                    </button>
            </Confirm>
          </td>
        </tr>
      )
    });
  }

  render() {
    return(
      <div>
        <Table striped condensed hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Role</th>
              <th>Email</th>
              <th>Firstname</th>
              <th>Lastname</th>
              <th>Locale</th>
              <th>District</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.renderRows()}
          </tbody>
        </Table>
        <ManageUserUpdateModal socket={this.props.socket}
                               user={this.state.selectedUser}
                               showModal={this.state.showUpdateModal}
                               toggleModal={this.toggleUpdateModal.bind(this)} />
      </div>
    );
  }

}
