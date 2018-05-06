import React from 'react';
import styles from './participants.scss';
import Slider from "react-slick";

export default class ConferenceParticipants extends React.Component {

  renderParticipants() {
    return this.props.streamEvents.map((streamEvent, key) => {
      if (this.props.localStream.getID() !== streamEvent.stream.getID()) {
        setTimeout(() => {
          streamEvent.stream.play(`participant-${streamEvent.stream.getID()}`);
        }, 1000);
        return(
          <div id={`participant-${streamEvent.stream.getID()}`}
               key={key}
               className={styles.participants}>
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
