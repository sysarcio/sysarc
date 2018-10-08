import React, { Component } from 'react';
import io from 'socket.io-client';
import Client from './Client.jsx';
import Server from './Server.jsx';
import Database from './Database.jsx';
import { throws } from 'assert';
import canvg from 'canvg';
import axios from 'axios';
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
      console.log('node added event received: ', data);
      this.setNodes(data);
    });

    this.socket.on('node moved', data => {
      console.log('node moved event received: ', data);
      this.setNodes(data);
    });

    this.socket.on('node deleted', data => {
      console.log('node deleted event received: ', data);
      this.setNodes(data);
    });

    this.socket.on('route added', data => {
      console.log('route added event received: ', data);
      this.setNodes(data);
    });

    this.socket.on('route updated', data => {
      this.setNodes(data);
    });

    this.socket.on('route deleted', data => {
      this.setNodes(data);
    });

    this.get = this.get.bind(this);
    this.uploadScreenshot = this.uploadScreenshot.bind(this);
    this.downloadScreenshot = this.downloadScreenshot.bind(this);
    this.takeScreenshot = this.takeScreenshot.bind(this);
    this.handleNewNode = this.handleNewNode.bind(this);
    this.handleNodeMove = this.handleNodeMove.bind(this);
    this.handleNodeDelete = this.handleNodeDelete.bind(this);
    this.handleNewNodeRoute = this.handleNewNodeRoute.bind(this);
    this.handleRouteUpdate = this.handleRouteUpdate.bind(this);
    this.handleRouteDelete = this.handleRouteDelete.bind(this);
  }

  get(node, prop) {
    let i = node._fieldLookup[prop];
    return node._fields[i];
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

  uploadScreenshot() {
    //get the PNG URL to generate a snapshot of the page
    let imageURL = this.takeScreenshot();

    const options = {
      method: 'POST',
      url: '/api/uploadScreenshot',
      data: {
        canvasID: window.location.href.split('/canvas/')[1],
        image: imageURL
      }
    };

    axios(options)
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        // Actually show user what went wrong
        console.log(err);
      });
  }

  downloadScreenshot() {
    //get the PNG URL to generate a snapshot of the page
    let imageURL = this.takeScreenshot();
    // console.log(imageURL);
    //create a new anchor to hold the image and download event
    var a = window.document.createElement('a');

    //set the href to your url, and give it the PNG type.
    (a.href = imageURL), { type: 'image/png' };

    //set the filename
    a.download = 'canvas.png';

    //append download to body
    document.body.appendChild(a);

    //execute click event on element
    a.click();

    // Remove anchor from body
    document.body.removeChild(a);
  }

  takeScreenshot() {
    // create a new object that contains all the SVGs currently on the board
    let canvasView = document.querySelector('.canvas');

    //create a clone so we can manipulate without changing the user's view
    let canvasViewClone = canvasView.cloneNode(true);

    // add grey background to screenshot
    canvasViewClone.innerHTML =
      '<g> <rect x="0" y="0" width="100%" height="400px" fill="#BEBEBE" /></g>' +
      canvasViewClone.innerHTML;

    //create a blank canvas to draw the board onto
    var canvas = document.createElement('canvas');

    //draw the board onto the canvas
    canvg(canvas, canvasViewClone.outerHTML);

    //return a URL to point to the PNG screenshot of the canvas
    return canvas.toDataURL('image/png');
  }

  handleNodeMove(data, cb) {
    data.room = this.props.match.params.name;
    this.uploadScreenshot();
    this.socket.emit('move node', data);
  }

  handleNodeDelete(data) {
    data.room = this.props.match.params.name;
    this.uploadScreenshot();
    this.socket.emit('delete node', data);
  }

  //{id:'', route: '', text: ''}
  handleNewNodeRoute(data) {
    data.room = this.props.match.params.name;
    this.uploadScreenshot();
    console.log('about to send new route: ', data);
    this.socket.emit('add route', data);
  }

  handleRouteUpdate(data) {
    data.room = this.props.match.params.name;
    // this.uploadScreenshot();
    console.log('about to send updated route: ', data);
    this.socket.emit('update route', data);
  }

  handleRouteDelete(data) {
    data.room = this.props.match.params.name;
    // this.uploadScreenshot();
    console.log('about to send deleted route: ', data);
    this.socket.emit('delete route', data);
  }

  render() {
    const showNodes = this.state.nodes.map(node => {
      if (this.get(node, 'type') === 'SERVER') {
        return (
          <Server
            get={this.get}
            routes={this.get(node, 'routes')}
            id={this.get(node, 'id')}
            key={this.get(node, 'id')}
            x={this.get(node, 'x')}
            y={this.get(node, 'y')}
            handleMovement={this.handleNodeMove}
            handleNewRoute={this.handleNewNodeRoute}
            handleRouteDelete={this.handleRouteDelete}
            handleRouteUpdate={this.handleRouteUpdate}
            handleDelete={this.handleNodeDelete}
          />
        );
      } else if (this.get(node, 'type') === 'DATABASE') {
        return (
          <Database
            get={this.get}
            routes={this.get(node, 'routes')}
            id={this.get(node, 'id')}
            key={this.get(node, 'id')}
            x={this.get(node, 'x')}
            y={this.get(node, 'y')}
            handleMovement={this.handleNodeMove}
            handleNewRoute={this.handleNewNodeRoute}
            handleRouteDelete={this.handleRouteDelete}
            handleRouteUpdate={this.handleRouteUpdate}
            handleDelete={this.handleNodeDelete}
          />
        );
      } else {
        return (
          <Client
            get={this.get}
            routes={this.get(node, 'routes')}
            id={this.get(node, 'id')}
            key={this.get(node, 'id')}
            x={this.get(node, 'x')}
            y={this.get(node, 'y')}
            handleMovement={this.handleNodeMove}
            handleNewRoute={this.handleNewNodeRoute}
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
        <div className="canvas-container">
          <svg className="canvas">{showNodes}</svg>
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
            <button onClick={this.downloadScreenshot}> Save Canvas </button>
            <button onClick={this.uploadScreenshot}> Upload Canvas </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Canvas;
