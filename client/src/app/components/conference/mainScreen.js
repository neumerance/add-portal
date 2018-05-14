import React from 'react';
import styles from './mainScreen.scss';
import ConferenceParticipants from './participants';
import StreamDisplay from './streamDisplay';
import ConferenceChatBox from './chatbox';
import * as _ from 'lodash';

export default class ConferenceMainScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      streamEvents: [],
      streamMessages: []
    }
    this.localStream = Erizo.Stream({audio: false, video: true, data: true, attributes: {user: this.props.user} });
    this.room = Erizo.Room({token: this.props.roomToken});
  }

  componentDidMount() {
    this.init();
    this.localStream.init();
  }

  init() {
    const self = this;
    self.localStream.addEventListener("access-accepted", () => {
      setTimeout(() => {
        self.room.addEventListener("room-connected", function (roomEvent) {
          self.room.publish(self.localStream);
          self.subscribeToStreams(roomEvent.streams);
        });

        self.room.addEventListener("stream-subscribed", (streamEvent) => {
          const streamEvents = this.state.streamEvents;
          streamEvents.push(streamEvent);
          self.setState({ streamEvents });
          this.subscribeToStreamData(streamEvent);
        });

        self.room.addEventListener("stream-added", (streamEvent) => {
          self.room.subscribe(streamEvent.stream);
        });

        self.room.addEventListener("stream-removed", (streamEvent) => {
          const id = streamEvent.stream.getID();
          const streamEvents = this.state.streamEvents;
          const index = _.findIndex(streamEvents, (strmEvnt) => { return strmEvnt.stream.getID() === id });
          if (index >= 0) {
            _.pullAt(streamEvents, [index]);
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

  subscribeToStreamData(streamEvent) {
    const self = this;
    streamEvent.stream.addEventListener("stream-data", (evt) => {
      console.log('evt', evt.msg);
      const streamMessages = this.state.streamMessages;
      streamMessages.push(evt.msg);
      self.setState({ streamMessages });
    });
  }

  renderLocalStream() {
    if (!this.localStream) { return null }
    return(
      <StreamDisplay stream={this.localStream} />
    );
  }

  render() {
    const self = this;
    return(
      <div id="conference relative">
        <div className={styles.mainScreen}>
          {this.renderLocalStream()}
        </div>
        <ConferenceParticipants streamEvents={this.state.streamEvents}
                                localStream={self.localStream} />
        <ConferenceChatBox user={this.props.user}
                           streamMessages={self.state.streamMessages}
                           localStream={self.localStream}  />
      </div>
    );
  }

}
