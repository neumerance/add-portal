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
import auth           from '../../services/auth/index';

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
      rooms: [{ name: 'No available rooms at the moment.' }],
      showCreateRoomModal: false
    }
  }

  render() {
    return(
      <AnimatedView>
        <Link to="/login">
          <button id="logout-btn" className="btn btn-default btn-xs pull-right m-20">LOG OUT</button>
        </Link>
        <div className={styles.channelPage}>
          <div>
            <h2 className="text-center white-text">Channel Selection</h2>
            <Row>
              <Col md={4} mdOffset={4} xs={12}>
                <div>
                <Link to="/manage-user">
                  <button className="btn btn-xs btn-info white-text">Manage users</button>
                </Link>
                  <button className="btn btn-xs btn-info white-text" onClick={this.toggleCreateRoomModal.bind(this)}><i className="fa fa-plus"></i> Create Channel</button>
                </div>
                {this.renderChannels()}
              </Col>
            </Row>
          </div>
          <CreateRoomModal
          socket={this.props.socket}
          showModal={this.state.showCreateRoomModal}
          toggleShowModal={this.toggleCreateRoomModal.bind(this)}
          socket={this.props.socket} />
        </div>
      </AnimatedView>
    );
  }

  componentDidMount() {
    this.props.socket.socket.emit('room#lists', {});
    this.props.socket.socket.on('broadcast::room#lists', (response) => {
      console.log('rooms: ', response.data);
      if (response.data) {
        if (response.data.length) {
          this.setState({ rooms: response.data });
        } else {
          this.setState({ rooms: [{ name: 'No available rooms at the moment.' }] })
        }
      }
    });
    this.props.socket.socket.on('room#receive::token', (response) => {
      if (response.data) {
        console.log('token', response.data);
        this.props.history.push(`/conference/${response.data}`);
      }
    });
  }

  refreshRoomList() {
    this.props.socket.socket.emit('room#lists', {});
  }

  destroyRoom(id) {
    this.props.socket.socket.emit('room#destroy', { roomId: id });
  }

  renderChannels() {
    let deleteBtn = null;
    return this.state.rooms.map((room, key) => {
      if (auth) {
        if (auth.role) {
          if (auth.role.isAdmin) {
            deleteBtn = <span className={`pull-right ${room._id ? 'show' : 'hide'}`} onClick={() => { this.destroyRoom(room._id) }}>
                          <i className="fa fa-times"></i>
                        </span>;
          }
          return(
            <div key={key} className={`${styles.ch} ${room._id === this.state.roomSelected ? styles.chActive : null}`}>
              <div className={styles.chContent}>
              {deleteBtn}
              <span className={styles.chTitle} onClick={ () => { this.joinRoom(room._id) } }>
                {room.name}
              </span>< br/>
              <span className={styles.chSub}>{room.data ? room.data.description : null}</span>
              </div>
            </div>
          )
        }
      } else {
        return this.renderChannels();
      }
    });
  }

  toggleCreateRoomModal() {
    this.setState({ showCreateRoomModal: !this.state.showCreateRoomModal });
  }

  joinRoom(roomId) {
    this.askRoomToken(roomId, auth.getUserInfo());
  }

  askRoomToken(roomId, userInfo) {
    console.log('userInfo', userInfo);
    this.props.socket.socket.emit('room#ask::token', {
      roomId: roomId,
      username: (userInfo.username || userInfo.email),
      role: userInfo.role
    });
  }
}

export default Home;
