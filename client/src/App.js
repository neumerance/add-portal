import React, { Component } from 'react';
import io from 'socket.io-client';
import './App.css';

class App extends Component {
  
  constructor(props) {
    super(props);
    this.socket = io('http://localhost:4000');
  }
  
  render() {
    return (
      <div className="App">
      
      </div>
    );
  }
}

export default App;
