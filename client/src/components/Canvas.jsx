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
      this.socket.emit('join room', this.props.match.params.name);
    });
    
    this.socket.on('room data', data => {
      this.setNodes(data);
    });

    this.socket.on('node added', data => {
      this.setNodes(data);
    });
    
    this.handleNewNode = this.handleNewNode.bind(this);
  }

  //data = {x: val, y: val, type: ''};
  handleNewNode(data) {
    data.room = this.props.match.params.name;
    this.socket.emit('add node', data);
  }

  setNodes(data) {
    this.setState({
      nodes: data
    });
  }

  render() {
    return (
      <div>
        <button onClick={() => this.handleNewNode({ position: { x: 20, y: 20 }, type: 'client' })}> Client +</button>
        <button onClick={() => this.handleNewNode({ position: { x: 40, y: 20 }, type: 'server' })}> Server +</button>
        {this.state.nodes.map((node, i) => <p key={i}>{node.type} at x:{node.position.x} y:{node.position.y}</p>)}
      </div>
    );
  }
}

export default Canvas;