import React from 'react';
import { Row, Col, Tab, Tabs }   from 'react-bootstrap';
import AnimatedView   from '../../components/animatedView/AnimatedView';
import ManageUserTable from '../../components/manageUser/userTable';
import ManageUserLocalTable from '../../components/manageUser/localTable';
import ManageUserCreateModal from '../../components/manageUser/createUserModal'
import styles from './manageUser.scss';
import * as _ from 'lodash';

export default class ManageUser extends React.Component {

  render() {
    return(
      <div className={styles.manageUser}>
        <Row>
          <Col md={8} mdOffset={2} xs={12}>
            <Tabs defaultActiveKey={1} id="managingTabs">
              <Tab eventKey={1} title="Manage User">
                <div className="tab-container">
                  <div className="pull-right">
                    <ManageUserCreateModal socket={this.props.socket} />
                  </div>
                  <ManageUserTable socket={this.props.socket} />
                </div>
              </Tab>
              <Tab eventKey={2} title="Manage Local">
                <div className="tab-container">
                  <ManageUserLocalTable socket={this.props.socket} />
                </div>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </div>
    )
  }

}
