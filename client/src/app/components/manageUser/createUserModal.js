import React from 'react';
import { Modal }   from 'react-bootstrap';
import * as _ from 'lodash';

export default class ManageUserCreateModal extends React.Component {

  constructor(props) {
    super(props);
    this.roles = [
      { id: 1, name: 'Admin' },
      { id: 2, name: 'Addpro' },
      { id: 3, name: 'Viewer' }
    ];
    this.state = {
      show: false,
      user: {
        email: null,
        password: null,
        firstname: null,
        lastname: null,
        role: null,
        userRoleId: null
      },
      userLocals: []
    }
  }

  componentDidMount() {
    this.props.socket.socket.emit('admin#ask::userLocal#lists');
    this.props.socket.socket.on('userLocal#lists', (resp) => {
      this.setState({ userLocals: resp });
    });
    this.props.socket.socket.on('broadcast::userLocal#lists', (resp) => {
      this.setState({ userLocals: resp });
    });
    this.props.socket.socket.on('success#message', () => {
      this.toggleShow();
    });
  }

  handleChange(field, value) {
    const user = this.state.user;
    _.set(user, field, value);
    this.setState({ user });
  }

  save() {
    this.props.socket.socket.emit('admin#ask::user#creation', this.state.user);
  }

  toggleShow() {
    this.setState({ show: !this.state.show })
  }

  renderRoleSelection() {
    return this.roles.map((role, key) => {
      return (
        <option key={`role-${key}`} value={role.id}>{role.name}</option>
      )
    });
  }

  renderUserLocalSelection() {
    return this.state.userLocals.map((local, key) => {
      return (
        <option key={`userLocal-${key}`} value={local.id}>{local.district}-{local.local}</option>
      )
    });
  }

  render() {
    return(
      <div>
        <button className="btn btn-xs btn-info" onClick={this.toggleShow.bind(this)}>
          <i className="fa fa-plus"></i> Add user
        </button>
        <Modal show={this.state.show} bsSize="small">
          <Modal.Header>
            <Modal.Title>Create user</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="email m-b-10">
              <input className="form-control"
                     type="text"
                     name="user[email]"
                     onChange={(e) => { this.handleChange('email', e.target.value) }}
                     placeholder="Email" />
            </div>
            <div className="password m-b-10">
              <input className="form-control"
                     type="password"
                     name="user[password]"
                     onChange={(e) => { this.handleChange('password', e.target.value) }}
                     placeholder="Password" />
            </div>
            <div className="firstname m-b-10">
              <input className="form-control"
                     type="text"
                     name="user[firstname]"
                     onChange={(e) => { this.handleChange('firstname', e.target.value) }}
                     placeholder="Firstname" />
            </div>
            <div className="lastname m-b-10">
              <input className="form-control"
                     type="text"
                     name="user[lastname]"
                     onChange={(e) => { this.handleChange('lastname', e.target.value) }}
                     placeholder="Lastname" />
            </div>
            <div className="role m-b-10">
              <select className="form-control"
                      name="user[role]"
                      onChange={(e) => { this.handleChange('role', e.target.value) }}>
                <option>-- Select role --</option>
                {this.renderRoleSelection()}
              </select>
            </div>
            <div className="userLocalId m-b-10">
              <select className="form-control"
                      name="user[userLocalId]"
                      onChange={(e) => { this.handleChange('userLocalId', e.target.value) }}>
                <option>-- Select local --</option>
                {this.renderUserLocalSelection()}
              </select>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-sm btn-default" onClick={this.toggleShow.bind(this)}>Cancel</button>
            <button className="btn btn-sm btn-info" onClick={this.save.bind(this)}>Save</button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

}
