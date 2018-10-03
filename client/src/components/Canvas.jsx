import React, { Component } from 'react';
import io from 'socket.io-client';
import Client from './Client.jsx';
import Server from './Server.jsx';
import Database from './Database.jsx';
import { throws } from 'assert';

// import styled from 'styled-components';
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
    // TODO: change the name of 'move node' emitter or listener later 
    this.socket.on('node moved', data => {
      this.setNodes(data);
    });

    this.socket.on('node deleted', data => {
      this.setNodes(data);
    })

    this.socket.on('node route updated', data => {
      this.setNodes(data);
    })

    this.handleNewNode = this.handleNewNode.bind(this);
    this.handleNodeMove = this.handleNodeMove.bind(this);
    this.handleNodeDelete = this.handleNodeDelete.bind(this);
    this.handleNodeRoute = this.handleNodeRoute.bind(this);
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

  handleNodeMove(data) {
    data.room = this.props.match.params.name;
    // console.log(`dummy output:`);
    // console.log(data);
    this.socket.emit('move node', data);
  }

  handleNodeDelete(data) {
    data.room = this.props.match.params.name;
    // console.log('deleted');
    this.socket.emit('delete node', data);
  }

  //{id:'', route: '', text: ''}
  handleNodeRoute(data) {
    data.room = this.props.match.params.name;
    console.log('updating route text');
    this.socket.emit('update route text', data);
  }

  render() {
    const svgStyle = {
      'border': '1px solid #ddd',
      'width': '100%',
      'height': '400px'
    }
    const showClients = this.state.nodes.map(node => {
      return node.type === 'CLIENT' ? <Client
                                        id={node.id} 
                                        key={node.id} 
                                        x={node.position.x} 
                                        y={node.position.y} 
                                        handleMovement={this.handleNodeMove} 
                                        handleRouteText={this.handleNodeRoute}
                                        handleDelete={this.handleNodeDelete} /> : null
    });
    return (
      <div>
        <button onClick={() => this.handleNewNode({ position: { x: 20, y: 20 }, type: 'CLIENT' })}> Client +</button>
        <button onClick={() => this.handleNewNode({ position: { x: 250, y: 20 }, type: 'SERVER' })}> Server +</button>
        <button onClick={() => this.handleNewNode({ position: { x: 350, y: 20 }, type: 'DATABASE' })}> Database +</button>
        <svg style={svgStyle}>
          {showClients}
        </svg>
      </div>
    );
  }
}

export default Canvas;