import React from 'react';
import styles from './chatbox.scss';
import * as _ from 'lodash';

export default class ConferenceChatBox extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      text: null,
      messages: []
    }
  }

  onChange(text) {
    this.setState({ text });
  }

  renderChatItems() {
    return this.props.streamMessages.map((message, key) => {
      return(
        <div key={`streamMessage-${key}`} className={styles.chatItem}>
          <span><strong>({message.user.local.local} {message.user.local.district})</strong> {message.user.firstname} {message.user.lastname}</span>
          <p>{message.text}</p>
        </div>
      )
    });
  }

  componentWillReceiveProps(nextProps) {
    this.scrollToBottom();
  }

  render() {
    return(
      <div className={styles.chatbox}>
        <div id="chatContainer" className={styles.chatContainer}>
          {this.renderChatItems()}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); this.sendData(); }}>
          <input type="text"
                 className="form-control"
                 placeholder="Say something"
                 defaultValue={this.state.text}
                 ref="text"
                 onChange={(e) => { this.onChange(e.target.value) }} />
        </form>
      </div>
    );
  }

  scrollToBottom() {
    $("#chatContainer").animate({ scrollTop: $('#chatContainer').prop("scrollHeight")}, 500);
  }

  sendData() {
    if (!this.state.text) { return }
    this.props.localStream.sendData({ text: this.state.text, user: this.props.user });
    this.setState({ text: null }, () => {
      this.refs.text.value = '';
    });
  }

}
