import React from 'react';
import auth from '../../services/auth/index';
import styles from './streamDisplay.scss';
import * as _ from 'lodash';

const user = auth.getUserInfo();

export default class StreamDisplay extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: null
    }
  }

  componentDidMount() {
    const self = this;
    setTimeout(() => {
      self.props.stream.play(`stream-${this.props.stream.getID()}`);
      const user = this.props.stream.getAttributes();
      if (user) {
        this.setState({ user: user.user });
      }
    }, 1000);
  }

  render() {
    return(
      <div className={`${styles.streamDisplay} relative`}>
        <div className={`text-right absolute ${styles.header}`}>
          <div className="white-text font1vw">{_.get(this.state.user, 'local.local')}, {_.get(this.state.user, 'local.city')}</div>
          <div className="white-text font-point8vw">{_.get(this.state.user, 'local.district')}</div>
        </div>
        <div id={`stream-${this.props.stream.getID()}`}
           className={styles.streamDisplay}>
        </div>
      </div>
    );
  }

}
