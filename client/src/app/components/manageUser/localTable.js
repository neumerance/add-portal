import React from 'react';
import { Table }   from 'react-bootstrap';
import * as _ from 'lodash';

export default class ManageUserLocalTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      locals: []
    }
  }

  componentDidMount() {
    this.props.socket.socket.emit('admin#ask::userLocal#lists');
    console.log('admin#ask::userLocal#lists');
    this.props.socket.socket.on('userLocal#lists', (resp) => {
      this.setState({ locals: resp });
    });
    this.props.socket.socket.on('broadcast::userLocal#lists', (resp) => {
      this.setState({ locals: resp });
    });
  }

  renderRows() {
    return this.state.locals.map((local, key) => {
      return(
        <tr key={`userLocal-${key}`}>
          <td>{local.id}</td>
          <td>{local.district}</td>
          <td>{local.local}</td>
          <td>{local.city}</td>
          <td>{local.province}</td>
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
            <th>District</th>
            <th>Local</th>
            <th>City / Town</th>
            <th>Province</th>
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