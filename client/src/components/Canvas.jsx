import React, { Component } from 'react';
import io from 'socket.io-client';
//import styled from 'styled-components';
//import Client from './components/Client.jsx';
//import { throws } from 'assert';
//import Node from './components/Node.jsx';

// const Svg = styled.svg`
//   border: 1px solid #ddd;
//   width: 100%;
//   height: 400px;
// `;


class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: false,
      nodes: [],
      method: {type: '', url: ''},
      
    };

    this.socket = io.connect();
    this.socket.on('connect', () => {
      console.log('socket connected client side');
      // this.socket.emit('join room', this.props.match.params.name);
    });
    this.socket.on('node added', data => {
      this.setState({
        nodes: [...this.state.nodes, data]
      })
    })
    this.handleNewNode = this.handleNewNode.bind(this)
  }

  //data = {x: val, y: val, type: ''};
  handleNewNode(data) {
    this.socket.emit('add node', data)
  }

  render() {
    return (
      <div>
        <button onClick={this.handleNewNode({ x: 20, y: 20, type: 'client' })}> Client +</button>
        
      </div>
    );
  }
}

export default Canvas;