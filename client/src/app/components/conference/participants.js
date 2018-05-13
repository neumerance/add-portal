import React from 'react';
import styles from './participants.scss';
import Slider from "react-slick";
import StreamDisplay from './streamDisplay';

export default class ConferenceParticipants extends React.Component {

  renderParticipants() {
    return this.props.streamEvents.map((streamEvent, key) => {
      if (this.props.localStream.getID() !== streamEvent.stream.getID()) {
        return(
          <div className={styles.participants}>
            <StreamDisplay stream={streamEvent.stream} />
          </div>
        );
      }
    });
  }

  render() {
    const settings = this.settings();
    return (
      <div className={styles.participants}>
        <Slider {...settings}>
          {this.renderParticipants()}
        </Slider>
      </div>
    );
  }

  settings() {
    return {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true
    };
  }

}
