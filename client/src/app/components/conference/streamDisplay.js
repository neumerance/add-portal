import React from 'react';
import auth from '../../services/auth/index';
import styles from './streamDisplay.scss';

const user = auth.getUserInfo();

export default class StreamDisplay extends React.Component {

  componentDidMount() {
    const self = this;
    setTimeout(() => {
      self.props.stream.play(`stream-${this.props.stream.getID()}`);
    }, 1000);
  }

  render() {
    return(
      <div id={`stream-${this.props.stream.getID()}`}
           className={styles.streamDisplay}>
      </div>
    );
  }

}
