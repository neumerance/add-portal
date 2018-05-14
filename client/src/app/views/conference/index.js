import React from 'react';
import ConferenceMainScreen from '../../components/conference/mainScreen';
import styles from './index.scss';
import auth from '../../services/auth/index';

export default class ConferenceIndex extends React.Component {

  renderMainScreen() {
    const user = this.getUser();
    if (user) {
      return <ConferenceMainScreen socket={this.props.socket}
                                   roomToken={ this.props.match.params.token }
                                   user={user} />;
    } else {
      return this.renderMainScreen();
    }
  }

  render() {
    return(
      <div className={styles.conference}>
        { this.renderMainScreen() }
      </div>
    );
  }

  getUser() {
    return auth.getUserInfo();
  }

}
