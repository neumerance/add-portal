// @flow weak

import React, {
  PureComponent
}                     from 'react';
import PropTypes      from 'prop-types';
import classnames     from 'classnames/bind';
import { Link }       from 'react-router-dom';
import AnimatedView   from '../../components/animatedView/AnimatedView';
import { Row, Col }   from 'react-bootstrap';
import CreateRoomModal from '../../components/modals/create_room_modal';
import styles         from './home.scss';

// IMPORTANT: we need to bind classnames to CSSModule generated classes:
const cx = classnames.bind(styles);

class Home extends PureComponent {
  static propTypes= {
    // react-router 4:
    match:    PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history:  PropTypes.object.isRequired,
    socket:    PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      roomSelected: null,
      rooms: [{ room_description: 'No available rooms at the moment.' }],
      showCreateRoomModal: false
    }
  }

  render() {
    return(
      <AnimatedView>
        <div className="m-t-10-percent">
          <h2 className="text-center white-text">Channel Selection</h2>
          <Row>
            <Col md={4} mdOffset={4} xs={12}>
              <Row className="m-t-4">
                <Col className="text-right" md={12} xs={12}>
                  <a href="javascript:void(0)"
                  className="white-text" onClick={this.toggleCreateRoomModal.bind(this)}><i className="fa fa-plus"></i> Create Channel</a>
                </Col>
              </Row>
              {this.renderChannels()}
              <Row className="m-t-4">
                <Col className="p-r-0" md={6} xs={6}>
                  <button className="btn btn-info btn-sm btn-block">JOIN</button>
                </Col>
                <Col className="p-l-0" md={6} xs={6}>
                  <button className="btn btn-default btn-sm btn-block">LOG OUT</button>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <CreateRoomModal
        socket={this.props.socket}
        showModal={this.state.showCreateRoomModal}
        toggleShowModal={this.toggleCreateRoomModal.bind(this)} />
      </AnimatedView>
    );
  }

  componentDidMount() {
    this.props.socket.socket.emit('room#getLists', {});
    this.props.socket.socket.on('room#lists', (rooms) => {
      this.setState({ rooms });
    });
  }

  renderChannels() {
    return this.state.rooms.map((room, key) => {
      return(
        <div key={key} className={`${styles.ch} ${room._id === this.state.roomSelected ? styles.chActive : null}`}>
          { room.name ? <div className={styles.chIcon}><i className="fa fa-users fa-2x"></i></div> : null }
          <div className={styles.chContent}>
            { room.name ? <h4 className={styles.chTitle}>{room.name}</h4> : null }
            <h5 className={styles.chSub}>{room.room_description}</h5>
          </div>
        </div>
      )
    });
  }

  toggleCreateRoomModal() {
    this.setState({ showCreateRoomModal: !this.state.showCreateRoomModal });
  }
}

export default Home;
