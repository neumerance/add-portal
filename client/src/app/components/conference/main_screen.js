import React from 'react';
import styles from './main_screen.scss';
import auth from '../../services/auth/index';
import ConferenceParticipants from './participants';
import * as _ from 'lodash';
const user = auth.getUserInfo();

export default class ConferenceMainScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      streamEvents: []
    }
    this.localStream = Erizo.Stream({audio: true, video: true, data: false, attributes: {name: user.email}});
    this.room = Erizo.Room({token: this.props.roomToken});
  }

  componentDidMount() {
    this.init();
    this.localStream.init();
  }

  init() {
    const self = this;
    self.localStream.addEventListener("access-accepted", () => {
      self.localStream.play("main-screen");
      setTimeout(() => {
        self.room.addEventListener("room-connected", function (roomEvent) {
          self.room.publish(self.localStream);
          self.subscribeToStreams(roomEvent.streams);
        });

        self.room.addEventListener("stream-subscribed", (streamEvent) => {
          const streamEvents = this.state.streamEvents;
          streamEvents.push(streamEvent);
          self.setState({ streamEvents });
        });

        self.room.addEventListener("stream-added", (streamEvent) => {
          self.room.subscribe(streamEvent.stream);
        });

        self.room.addEventListener("stream-removed", (streamEvent) => {
          const id = streamEvent.stream.getID();
          const streamEvents = this.state.streamEvents;
          const index = _.findIndex(streamEvents, (streamEvent) => { return streamEvent.stream.getID() === id });
          if (index) {
            streamEvents.pullAt(index);
            this.setState({ streamEvents });
          }
        });

        self.room.connect();
      }, 1000);
    });
  }

  subscribeToStreams(streams) {
    for (var index in streams) {
      var stream = streams[index];
      if (this.localStream.getID() !== stream.getID()) {
          this.room.subscribe(stream);
      }
    }
  }

  renderParticipants() {
    return this.state.streamEvents.map((streamEvent, key) => {
      setTimeout(() => {
        streamEvent.stream.play(`participant-${streamEvent.stream.getID()}`);
      }, 1000);
      return(
        <div id={`participant-${streamEvent.stream.getID()}`}
             key={key}
             className={styles.participants}>
        </div>
      );
    });
  }

  render() {
    return(
      <div>
        <div id="main-screen" className={styles.mainScreen}>
        </div>
        <div className={styles.participantsPanel}>
          {this.renderParticipants()}
        </div>
      </div>
    );
  }

}
