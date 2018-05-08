import React from 'react';
import { Row, Col, Tab, Tabs, Table }   from 'react-bootstrap';
import AnimatedView   from '../../components/animatedView/AnimatedView';
import styles from './manageUser.scss';

export default class ManageUser extends React.Component {

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
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
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
