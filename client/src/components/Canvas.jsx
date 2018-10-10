import React, { Component } from 'react';
import io from 'socket.io-client';
import Client from './Client.jsx';
import Server from './Server.jsx';
import Database from './Database.jsx';
import { throws } from 'assert';
import canvg from 'canvg';
import axios from 'axios';

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: {}
    };

    this.socket = io.connect();
    this.socket.on('connect', () => {
      console.log('socket connected client side');
      this.socket.emit('join room', this.props.match.params.name);
    });

    this.socket.on('room data', data => {
      const nodes = data.reduce((o, n) => {
        o[this.get(n, 'id')] = {
          id: this.get(n, 'id'),
          x: this.get(n, 'x'),
          y: this.get(n, 'y'),
          type: this.get(n, 'type'),
          created_at: this.get(n, 'created_at')
        };
        return o;
      }, {});

      this.setNodes(nodes);
    });

    this.socket.on('node added', node => {
      node = {
        id: this.get(node, 'id'),
        x: this.get(node, 'x'),
        y: this.get(node, 'y'),
        type: this.get(node, 'type'),
        created_at: this.get(node, 'created_at')
      }
      this.addNode(node);
    });

    this.socket.on('node moved', node => {
      this.moveNode(node);
    });

    this.socket.on('node deleted', id => {
      this.deleteNode(id);
    });

    // this.socket.on('route added', data => {
    //   this.setNodes(data);
    // });

    // this.socket.on('route updated', data => {
    //   this.setNodes(data);
    // });

    // this.socket.on('route deleted', data => {
    //   this.setNodes(data);
    // });

    this.get = this.get.bind(this);
    this.handleNewNode = this.handleNewNode.bind(this);
    this.handleNodeMove = this.handleNodeMove.bind(this);
    this.handleNodeDelete = this.handleNodeDelete.bind(this);
    this.moveNode = this.moveNode.bind(this);

    this.handleNewRoute = this.handleNewRoute.bind(this);
  }

  get(node, prop) {
    let i = node._fieldLookup[prop];
    return node._fields[i];
  }
  
  setNodes(data) {
    this.setState({
      nodes: data
    });
  }

  addNode(node) {
    const nodes = JSON.parse(JSON.stringify(this.state.nodes));
    nodes[node.id] = node;
    this.setState({
      nodes
    });
  }

  moveNode(node) {
    const nodes = JSON.parse(JSON.stringify(this.state.nodes));
    const id = this.get(node, 'id');
    nodes[id].x = this.get(node, 'x');
    nodes[id].y = this.get(node, 'y');
    this.setState({
      nodes
    });
  }

  deleteNode(id) {
    const nodes = JSON.parse(JSON.stringify(this.state.nodes));
    delete nodes[id];
    this.setState({
      nodes
    });
  }

  //data = {x: val, y: val, type: '', routes: [{routeId: '5tgdr', method: 'get', url: '/clientsomething'}, {method: 'post, url: ''}];
  handleNewNode(data) {
    data.room = this.props.match.params.name;
    this.socket.emit('add node', data);
  }

  handleNewRoute(e) {
    
  }

  handleNodeMove(data) {
    data.room = this.props.match.params.name;
    // this.uploadScreenshot();
    this.socket.emit('move node', data);
  }

  handleNodeDelete(data) {
    data.room = this.props.match.params.name;
    // this.uploadScreenshot();
    this.socket.emit('delete node', data);
  }

  handleNewNodeRoute(data) {
    data.room = this.props.match.params.name;
    // this.uploadScreenshot();
    this.socket.emit('add route', data);
  }

  handleRouteUpdate(data) {
    data.room = this.props.match.params.name;
    // this.uploadScreenshot();
    this.socket.emit('update route', data);
  }

  handleRouteDelete(data) {
    data.room = this.props.match.params.name;
    // this.uploadScreenshot();
    this.socket.emit('delete route', data);
  }

  render() {
    const showNodes = Object.values(this.state.nodes).map(node => {
      if (node.type === 'SERVER') {
        return (
          <Server
            node={node}
            key={node.id}
            handleMovement={this.handleNodeMove}
            handleNewRoute={this.handleNewRoute}
            handleRouteDelete={this.handleRouteDelete}
            handleRouteUpdate={this.handleRouteUpdate}
            handleDelete={this.handleNodeDelete}
          />
        );
      } else if (node.type === 'CLIENT') {
        return (
          <Client
            node={node}
            key={node.id}
            handleMovement={this.handleNodeMove}
            handleNewRoute={this.handleNewRoute}
            handleRouteDelete={this.handleRouteDelete}
            handleRouteUpdate={this.handleRouteUpdate}
            handleDelete={this.handleNodeDelete}
          />
        );
      } else if (node.type === 'DATABASE') {
        return (
          <Database
            node={node}
            key={node.id}
            handleMovement={this.handleNodeMove}
            handleNewRoute={this.handleNewRoute}
            handleRouteDelete={this.handleRouteDelete}
            handleRouteUpdate={this.handleRouteUpdate}
            handleDelete={this.handleNodeDelete}
          />
        );
      }
    });

    return (
      <div>
        <h2>Shark.io</h2>
        <div id="canvas-container">
          <div id="canvas">{showNodes}</div>
          <div className="tool-bar">
            <button
              onClick={() =>
                this.handleNewNode({
                  position: { x: 20, y: 20 },
                  type: 'CLIENT'
                })
              }
            >
              {' '}
              Client +
            </button>
            <button
              onClick={() =>
                this.handleNewNode({
                  position: { x: 250, y: 20 },
                  type: 'SERVER'
                })
              }
            >
              {' '}
              Server +
            </button>
            <button
              onClick={() =>
                this.handleNewNode({
                  position: { x: 350, y: 20 },
                  type: 'DATABASE'
                })
              }
            >
              {' '}
              Database +
            </button>
            {/* <button onClick={this.downloadScreenshot}> Save Canvas </button>
            <button onClick={this.uploadScreenshot}> Upload Canvas </button> */}
          </div>
        </div>
      </div>
    );
  }
}

export default Canvas;