import React from 'react';
import ConferenceMainScreen from '../../components/conference/main_screen';

export default class ConferenceIndex extends React.Component {

  render() {
    console.log('props', this.props);
    return(
      <ConferenceMainScreen roomToken={ this.props.match.params.token } />
    );
  }

}
