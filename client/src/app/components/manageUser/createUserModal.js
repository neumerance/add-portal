import React from 'react';
import { Modal }   from 'react-bootstrap';
import * as _ from 'lodash';

export default class ManageUserCreateModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      user: {
        email: null,
        password: null,
        firstname: null,
        lastname: null,
        role: null,
        userRoleId: null
      }
    }
  }

  handleChange(field, value) {
    const user = this.state.user;
    _.set(user, field, value);
    this.setState({ user });
  }

  save() {

  }

  toggleShow() {
    this.setState({ show: !this.state.show })
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
                     onChange={(e) => { this.handleChange('email', e.target) }} 
                     placeholder="Email" /> 
            </div>
            <div className="password m-b-10">
              <input className="form-control" 
                     type="password" 
                     name="user[password]" 
                     onChange={(e) => { this.handleChange('password', e.target) }}
                     placeholder="Password" /> 
            </div>
            <div className="firstname m-b-10">
              <input className="form-control" 
                     type="text" 
                     name="user[firstname]" 
                     onChange={(e) => { this.handleChange('firstname', e.target) }} 
                     placeholder="Firstname" /> 
            </div>
            <div className="lastname m-b-10">
              <input className="form-control" 
                     type="text" 
                     name="user[lastname]" 
                     onChange={(e) => { this.handleChange('lastname', e.target) }} 
                     placeholder="Lastname" /> 
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