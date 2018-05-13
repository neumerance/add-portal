import React from 'react';
import { Carousel } from 'react-bootstrap';
import styles from './participants.scss';
import StreamDisplay from './streamDisplay';

export default class ConferenceParticipants extends React.Component {

  renderParticipants() {
    return this.props.streamEvents.map((streamEvent, key) => {
      if (this.props.localStream.getID() !== streamEvent.stream.getID()) {
        return(
          <Carousel.Item key={`streams-${key}`}>
            <div className={styles.participants}>
              <StreamDisplay stream={streamEvent.stream} />
            </div>
          </Carousel.Item>
        );
      }
    });
  }

  render() {
    return (
      <Carousel pauseOnHover={false} interval={3000}>
        {this.renderParticipants()}
      </Carousel>
    );
  }

}
