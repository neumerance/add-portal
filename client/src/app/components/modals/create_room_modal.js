import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, ControlLabel, Modal } from 'react-bootstrap';
import ToggleButton from 'react-toggle-button'
import * as _ from 'lodash';

class CreateRoomModal extends React.Component {

  static propTypes = {
    socket: PropTypes.object.isRequired,
    showModal: PropTypes.bool.isRequired,
    toggleShowModal: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      room: {
        roomName: '',
        description: '',
        p2p: false
      }
    }
  }

  handleInput(value = '', field = '') {
    const state = this.state;
    _.set(state, field, value);
    this.setState({ ...state });
  }

  handleCreateChannel() {
    this.props.socket.socket.emit('room#create', this.state.room);
    this.props.toggleShowModal();
  }

  render() {
    return(
      <Modal show={this.props.showModal}>
        <Modal.Header>
          <Modal.Title>Create Channel</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup controlId="channelName">
            <ControlLabel>Channel name</ControlLabel>
            <FormControl
              type="text"
              value={this.state.room.roomName}
              placeholder="Enter channel name"
              onChange={(e) => { this.handleInput(e.target.value, 'room.roomName') }}
            />
          </FormGroup>
          <FormGroup controlId="channelDescription">
            <ControlLabel>Channel description</ControlLabel>
            <FormControl
              componentClass="textarea"
              value={this.state.room.description}
              placeholder="Enter channel description"
              onChange={(e) => { this.handleInput(e.target.value, 'room.description') }}
            />
          </FormGroup>
          <FormGroup controlId="channelP2pOption">
            <div className="inline-display m-r-5">
              <ToggleButton
              value={ this.state.room.p2p || false }
              onToggle={(value) => { this.handleInput(!value, 'room.p2p') }} />
            </div>
            <div className="inline-display">
              Channel for 2 person only.
            </div>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <button
          className="btn btn-info btn-sm"
          onClick={this.handleCreateChannel.bind(this)}>
            Save
          </button>
          <button
          className="btn btn-default btn-sm"
          onClick={this.props.toggleShowModal.bind(this)}>
            Cancel
          </button>
        </Modal.Footer>
      </Modal>
    )
  }

}

export default CreateRoomModal;
