import React from 'react';
import { Table }   from 'react-bootstrap';
// import * as _ from 'lodash';

export default class ManageUserTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      users: []
    }
  }

  componentDidMount() {
    this.props.socket.socket.emit('admin#ask::user#lists');
    console.log('admin#ask::user#lists');
    this.props.socket.socket.on('user#lists', (resp) => {
      this.setState({ users: resp });
    });
    this.props.socket.socket.on('broadcast::user#lists', (resp) => {
      this.setState({ users: resp });
    });
  }

  renderRows() {
    return this.state.users.map((user, key) => {
      return(
        <tr key={`userTable-${key}`}>
          <td>{user.id}</td>
          <td>{user.email}</td>
          <td>{user.firstname}</td>
          <td>{user.lastname}</td>
          <td>{_.get(user, 'userLocal.local')}</td>
          <td>{_.get(user, 'userLocal.district')}</td>
          <td></td>
        </tr>
      )
    });
  }

  render() {
    return(
      <Table striped condensed hover>
        <thead>
          <tr>
            <th>#</th>
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
    );
  }

}