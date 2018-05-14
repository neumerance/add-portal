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

  renderLabel() {
    if (!this.props.label) return null;
    return(
      <div className={`text-right absolute ${styles.header}`}>
        <label className={`white-text float-right font-4vh blackToTransparent ${styles.labels}`}>{_.get(this.state.user, 'local.local')}, {_.get(this.state.user, 'local.city')}</label><br />
        <label className={`white-text float-right font-3vh blackToTransparent ${styles.labels}`}>{_.get(this.state.user, 'local.district')}</label>
      </div>
    );
  }

  render() {
    return(
      <div className={`${styles.streamDisplay} relative`}>
        {this.renderLabel()}
        <div id={`stream-${this.props.stream.getID()}`}
           className={styles.streamDisplay}>
        </div>
      </div>
    );
  }

}
