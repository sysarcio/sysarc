import React, { Component } from 'react';
import io from 'socket.io-client';

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };

    this.socket = io.connect();
    this.socket.on('connect', () => {
      console.log('socket connected client side');
      // this.socket.emit('join room', this.props.match.params.name);
    });
  }

  render() {
    return (
      <div>
        
      </div>
    );
  }
}

export default Canvas;