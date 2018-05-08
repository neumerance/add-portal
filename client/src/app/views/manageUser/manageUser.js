import React from 'react';
import { Row, Col, Tab, Tabs, Table }   from 'react-bootstrap';
import AnimatedView   from '../../components/animatedView/AnimatedView';
import styles from './manageUser.scss';

export default class ManageUser extends React.Component {

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
        <tr key={key}>
          <td>{user.id}</td>
          <td>{user.email}</td>
          <td>{user.firstname}</td>
          <td>{user.lastname}</td>
          <td>{user.userLocal.local}</td>
          <td>{user.userLocal.district}</td>
          <td></td>
        </tr>
      )
    });
  }

  render() {
    return(
      <div className={styles.manageUser}>
        <Row>
          <Col md={8} mdOffset={2} xs={12}>
            <Tabs defaultActiveKey={1} id="managingTabs">
              <Tab eventKey={1} title="Manage User">
                <div className="tab-container">
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
                      <tr>
                        <td></td>
                        <td><input type="text" placeholder="email" /></td>
                        <td><input type="password" placeholder="password" /></td>
                        <td><input type="text" placeholder="firstname" /></td>
                        <td><input type="text" placeholder="lastname" /></td>
                        <td>
                          <select>
                            <option>-- Select Locale --</option>
                          </select>
                        </td>
                        <td>
                        </td>
                      </tr>
                      {this.renderRows()}
                    </tbody>
                  </Table>
                </div>
              </Tab>
              <Tab eventKey={2} title="Manage Local">
              <div className="tab-container">
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
                </div>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </div>
    )
  }

}
