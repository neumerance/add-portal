import React from 'react';
import styles from './main_screen.scss';
import auth from '../../services/auth/index';
const user = auth.getUserInfo();

export default class ConferenceMainScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      participants: []
    }
    this.localStream = Erizo.Stream({audio: true, video: true, data: false, attributes: {name: user.email}});
    this.room = Erizo.Room({token: this.props.roomToken});
  }

  componentDidMount() {
    this.init();
    this.localStream.init();
  }

  init() {
    this.localStream.addEventListener("access-accepted", () => {
      this.whenConnected();
      this.whenSubscribedToStreams();
      this.whenAddedAStream();
      this.localStream.play("main-screen");
      setTimeout(() => {
        this.room.connect();
      }, 1000);
    });
  }

  whenConnected() {
    this.room.addEventListener("room-connected", (roomEvent) => {
      console.log('AddClient: ', 'You are now connected to the room.');
      console.log('AddClient: ', this.localStream);
      this.room.publish(this.localStream);
      // this.subscribeToStreams(roomEvent.streams);
    });
  }

  subscribeToStreams(streams = []) {
    streams.forEach(stream => {
      if (stream.getID() !== this.localStream.getID()) {
        this.room.subscribe(stream);
      }
    });
  };

  whenSubscribedToStreams() {
    this.room.addEventListener("stream-subscribed", (streamEvent) => {
      const participants = this.state.participants;
      participants.push(streamEvent);
      this.setState({ participants }, () => {
        this.state.participants.forEach((participant, key) => {
          const stream = participant.stream;
          stream.play(`participant-${stream}`);
        });
      });
    });
  }

  whenAddedAStream() {
    this.room.addEventListener("stream-added", (streamEvent) => {
      console.log('AddClient: ', 'Stream added');
      // const streams = [];
      // streams.push(streamEvent.stream);
      // this.subscribeToStreams(streams);
    });
  }

  // whenAStreamIsRemoved() {
  //   this.room.addEventListener("stream-removed", (streamEvent) => {
  //     const stream = streamEvent.stream;
  //     if (stream.elementID !== undefined) {

  //     }
  //   });
  // }

  renderParticipants() {
    return this.state.participants.map((participant, key) => {
      return(
        <div id={`participant-${participant.stream.getID()}`} key={key} className={styles.participantsPanel.participants}></div>
      );
    });
  }

  render() {
    return(
      <div id="main-screen" className={styles.mainScreen}>
        <div className={styles.participantsPanel}>
          {this.renderParticipants()}
        </div>
      </div>
    );
  }

}
