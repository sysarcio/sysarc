import React, { Component } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';
import Client from './Client.jsx';
import Server from './Server.jsx';
import Database from './Database.jsx';
import { throws } from 'assert';

const Svg = styled.svg`
  border: 1px solid #ddd;
  width: 100%;
  height: 400px;
`;


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

  //data = {x: val, y: val, type: '', routes: [{method: 'get', url: '/clientsomething'}, {method: 'post, url: ''}];
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
    const showClients = nodes.filter((node, i) => {
      return node.type === 'client' ? <Client x={node.x} y={node.y}/> : null
    })
    return (
      <div>
        <button onClick={() => this.handleNewNode({ position: { x: 20, y: 20 }, type: 'client' })}> Client +</button>
        <button onClick={() => this.handleNewNode({ position: { x: 250, y: 20 }, type: 'server' })}> Server +</button>
        <button onClick={() => this.handleNewNode({ position: { x: 350, y: 20 }, type: 'database' })}> Database +</button>
        {/* {this.state.nodes.map((node, i) => <p key={i}>{node.type} at x:{node.position.x} y:{node.position.y}</p>)} */}
        <Svg>
         {showClients}
        </Svg>
      </div>
    );
  }
}

export default Canvas;