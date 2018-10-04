import React, { Component } from 'react';
import io from 'socket.io-client';
import Client from './Client.jsx';
import Server from './Server.jsx';
import Database from './Database.jsx';
import { throws } from 'assert';
import canvg from 'canvg';

import styled from 'styled-components';

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
      method: { type: '', url: '' }
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
    });

    this.socket.on('route added', data => {
      this.setNodes(data);
    });
    this.takeScreenshot = this.takeScreenshot.bind(this);
    this.handleNewNode = this.handleNewNode.bind(this);
    this.handleNodeMove = this.handleNodeMove.bind(this);
    this.handleNodeDelete = this.handleNodeDelete.bind(this);
    this.handleNewNodeRoute = this.handleNewNodeRoute.bind(this);
  }

  //data = {x: val, y: val, type: '', routes: [{routeId: '5tgdr', method: 'get', url: '/clientsomething'}, {method: 'post, url: ''}];
  handleNewNode(data) {
    data.room = this.props.match.params.name;
    this.socket.emit('add node', data);
  }

  setNodes(data) {
    this.setState({
      nodes: data
    });
  }

  takeScreenshot() {
    // create a new object that contains all the SVGs currently on the board
    let canvasView = document.querySelector('.canvas');

    //create a blank canvas to draw the board onto
    var canvas = document.createElement('canvas');

    //draw the board onto the canvas
    canvg(canvas, canvasView.outerHTML);

    //create a URL to point to the PNG screenshot of the canvas
    let downloadURL = canvas.toDataURL('image/png');

    //create a new anchor to hold the image and download event
    var a = window.document.createElement('a');

    //set the href to your url, and give it the PNG type.
    (a.href = downloadURL), { type: 'image/png' };

    //set the filename
    a.download = 'canvas.png';

    //append download to body
    document.body.appendChild(a);

    //execute click event on element
    a.click();

    // Remove anchor from body
    document.body.removeChild(a);
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
  handleNewNodeRoute(data) {
    console.log('new route data-->', data);
    data.room = this.props.match.params.name;
    this.socket.emit('add route', data);
  }

  render() {
    const svgStyle = {
      border: '1px solid white',
      width: '100%',
      height: '400px'
    };
    const showClients = this.state.nodes.map(node => {
      console.log(node.routes);
      return node.type === 'CLIENT' ? (
        <Client
          id={node.id}
          key={node.id}
          x={node.position.x}
          y={node.position.y}
          handleMovement={this.handleNodeMove}
          handleNewRoute={this.handleNewNodeRoute}
          handleDelete={this.handleNodeDelete}
        />
      ) : null;
    });
    return (
      <div className="theCanvas">
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
        <button onClick={() => this.takeScreenshot()}> --Save Image -- </button>
        <svg className="canvas" style={svgStyle}>
          <g>
            <rect x="0" y="0" width="100%" height="400px" fill="#fff" />
          </g>
          {showClients}
        </svg>
      </div>
    );
  }
}

export default Canvas;
