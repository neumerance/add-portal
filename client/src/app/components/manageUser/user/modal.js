import React from 'react';
import { Modal }   from 'react-bootstrap';
import * as _ from 'lodash';

export default class ManageUserModal extends React.Component {
  constructor(props) {
    super(props);
    this.roles = [
      { id: 1, name: 'Admin' },
      { id: 2, name: 'Addpro' },
      { id: 3, name: 'Viewer' }
    ];
    this.state = {
      user: {
        id: null,
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      if (nextProps.user.id != this.state.user.id) {
        this.setState({ user: nextProps.user });
      }
    } else {
      this.resetUserState();
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
      if (this.props.showModal) {
        this.props.toggleModal();
      }
    });
  }

  handleChange(field, value) {
    const user = this.state.user;
    _.set(user, field, value);
    this.setState({ user });
  }

  save() {
    if (this.state.user.id) {
      this.props.socket.socket.emit('admin#ask::user#update', this.state.user);
    } else {
      this.props.socket.socket.emit('admin#ask::user#creation', this.state.user);
    }
  }

  resetUserState() {
    this.setState({
      user: {
        id: null,
        email: null,
        password: null,
        firstname: null,
        lastname: null,
        role: null,
        userRoleId: null
      }
    });
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
        <Modal show={this.props.showModal} bsSize="small">
          <Modal.Body>
            <div className="email m-b-10">
              <input className="form-control"
                     type="text"
                     defaultValue={this.state.user.email}
                     onChange={(e) => { this.handleChange('email', e.target.value) }}
                     placeholder="Email" />
            </div>
            <div className="password m-b-10">
              <input className="form-control"
                     type="password"
                     defaultValue={this.state.user.password}
                     onChange={(e) => { this.handleChange('password', e.target.value) }}
                     placeholder="Password" />
            </div>
            <div className="firstname m-b-10">
              <input className="form-control"
                     type="text"
                     defaultValue={this.state.user.firstname}
                     onChange={(e) => { this.handleChange('firstname', e.target.value) }}
                     placeholder="Firstname" />
            </div>
            <div className="lastname m-b-10">
              <input className="form-control"
                     type="text"
                     defaultValue={this.state.user.lastname}
                     onChange={(e) => { this.handleChange('lastname', e.target.value) }}
                     placeholder="Lastname" />
            </div>
            <div className="role m-b-10">
              <select className="form-control"
                      defaultValue={this.state.user.role}
                      onChange={(e) => { this.handleChange('role', e.target.value) }}>
                <option>-- Select role --</option>
                {this.renderRoleSelection()}
              </select>
            </div>
            <div className="userLocalId m-b-10">
              <select className="form-control"
                      defaultValue={this.state.user.userLocalId}
                      onChange={(e) => { this.handleChange('userLocalId', e.target.value) }}>
                <option>-- Select local --</option>
                {this.renderUserLocalSelection()}
              </select>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-sm btn-default" onClick={this.props.toggleModal.bind(this)}>Cancel</button>
            <button className="btn btn-sm btn-info" onClick={this.save.bind(this)}>Save</button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

}
