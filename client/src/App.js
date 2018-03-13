import React, { Component } from 'react';
import io from 'socket.io-client';
import MainRoutes from './routes';

class App extends Component {
  
  constructor(props) {
    super(props);
    this.socket = io('http://localhost:4000');
  }
  
  render() {
    return (
      <div className="App">
        <MainRoutes />
      </div>
    );
  }
}

export default App;
