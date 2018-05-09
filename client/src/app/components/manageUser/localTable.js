import React from 'react';
import { Table }   from 'react-bootstrap';

export default class ManageUserLocalTable extends React.Component {

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
        </tbody>
      </Table>
    );
  }

}