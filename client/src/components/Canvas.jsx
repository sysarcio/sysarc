import React, { Component } from 'react';
import io from 'socket.io-client';
import { Stage, Layer, Rect } from 'react-konva';
import Konva from 'konva';
import axios from 'axios';

import Toolbar from './Toolbar.jsx';
import Node from './Node.jsx';
import RouteLine from './RouteLine.jsx';

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      nodeToAdd: null,
      connections: {},
      connector: null,
      nodes: {}
    };

    this.roomID = this.props.match.params.name;

    this.socket = io.connect();
    this.socket.on('connect', () => {
      console.log('socket connected client side');
      this.socket.emit('join room', this.roomID);
      this.getRoomData();
    });

    this.socket.on('node added', node => {
      this.handleNewNode(node);
    });

    this.socket.on('node moved', data => {
      this.updateNode(data);
    });

    this.socket.on('node deleted', data => {
      this.handleDeleteNode(data);
    });

    this.socket.on('connection made', data => {
      this.handleNewConnection(data);
    });

    this.socket.on('connection dragged', data => {
      this.updateConnection(data);
    });

    this.socket.on('connection deleted', id => {
      this.handleDeleteConnection(id);
    });

    this.moveNode = this.moveNode.bind(this);
    this.updateNode = this.updateNode.bind(this);
    this.placeNode = this.placeNode.bind(this);
    this.beginNewConnection = this.beginNewConnection.bind(this);
    this.handleNewConnection = this.handleNewConnection.bind(this);
    this.deleteConnection = this.deleteConnection.bind(this);
    this.handleLineClick = this.handleLineClick.bind(this);
    this.handlePointDrag = this.handlePointDrag.bind(this);
    this.handleLineDrop = this.handleLineDrop.bind(this);
    this.handleDeleteConnection = this.handleDeleteConnection.bind(this);
    this.updateConnection = this.updateConnection.bind(this);
    this.emitDeleteNode = this.emitDeleteNode.bind(this);
    this.prepNewNode = this.prepNewNode.bind(this);
    this.emitNewNode = this.emitNewNode.bind(this);
    this.handleNewNode = this.handleNewNode.bind(this);
    this.processScreenshot = this.processScreenshot.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', () => {
      this.setState({
        width: window.innerWidth,
        height: window.innerHeight
      });
    });
  }

  async getRoomData() {
    const options = {
      url: `/api/getRoomData/${this.roomID}`,
      method: 'GET'
    };

    try {
      const { data } = await axios(options);
      const { nodes, connections } = data;
      this.setState({
        nodes,
        connections
      });
    } catch (err) {
      console.log(err);
    }
  }

  beginNewConnection(connectee) {
    const { connector, nodes } = this.state;
    if (connector !== connectee) {
      if (connector) {
        const data = {
          connector: connector,
          connectee: connectee,
          handleX: nodes[connector].x + 150 + 75,
          handleY: (nodes[connector].y + 75 + nodes[connectee].y + 75) / 2 + 75
        };

        data.room = this.roomID;
        this.socket.emit('make connection', data);

        this.setState({
          connector: null
        });
      } else {
        this.setState({
          connector: connectee
        });
      }
    }
  }

  handleNewConnection(connection) {
    const connections = JSON.parse(JSON.stringify(this.state.connections));
    connections[connection.id] = connection;
    this.setState({
      connections
    });
  }

  updateConnection({ id, handleX, handleY }) {
    const connections = JSON.parse(JSON.stringify(this.state.connections));
    connections[id].handleX = handleX;
    connections[id].handleY = handleY;

    this.setState({
      connections
    });
  }

  deleteConnection(id) {
    const data = {
      room: this.roomID,
      id
    };
    this.socket.emit('delete connection', data);
  }

  handleLineDrop(data) {
    console.log(data);
    data.room = this.roomID;
    this.socket.emit('place connection', data);
  }

  handleLineClick([x, y]) {
    //console.log(x, y);
  }

  handlePointDrag(data) {
    data.room = this.roomID;
    this.socket.emit('drag connection', data);
  }

  handleDeleteConnection(id) {
    const connections = JSON.parse(JSON.stringify(this.state.connections));
    delete connections[id];
    this.setState({ connections });
  }

  prepNewNode(type) {
    this.setState(
      {
        nodeToAdd: type
      },
      () => {
        document.body.style.cursor = 'crosshair';
      }
    );
  }

  emitNewNode(e) {
    if (this.state.nodeToAdd) {
      const data = {
        x: e.evt.x,
        y: e.evt.y,
        type: this.state.nodeToAdd,
        room: this.roomID
      };
      this.socket.emit('add node', data);

      this.setState(
        {
          nodeToAdd: null
        },
        () => {
          document.body.style.cursor = 'default';
        }
      );
    }
  }

  handleNewNode(node) {
    const nodes = JSON.parse(JSON.stringify(this.state.nodes));
    nodes[node.id] = node;

    this.setState({
      nodes
    });
  }

  moveNode(data) {
    data.room = this.roomID;
    this.socket.emit('move node', data);
  }

  updateNode(data) {
    const newNodes = JSON.parse(JSON.stringify(this.state.nodes));
    newNodes[data.id].x = data.x;
    newNodes[data.id].y = data.y;
    this.setState({
      nodes: newNodes
    });
  }

  placeNode(data) {
    this.socket.emit('place node', data);
  }

  emitDeleteNode(id) {
    const data = {
      id,
      room: this.roomID
    };
    this.socket.emit('delete node', data);
  }

  handleDeleteNode(data) {
    const nodes = JSON.parse(JSON.stringify(this.state.nodes));
    const connections = JSON.parse(JSON.stringify(this.state.connections));

    delete nodes[data.id];

    data.connections.forEach(c => {
      delete connections[c];
    });

    this.setState({
      nodes,
      connections
    });
  }
  processScreenshot(type) {
    // //make a URL to point to the PNG recreation of the canvas
    let screenshotURL = document
      .getElementsByTagName('canvas')[0]
      .toDataURL('image/png');

    if (type === 'DOWNLOAD') {
      var a = window.document.createElement('a');
      //set the href to your url, and give it the PNG type.
      (a.href = screenshotURL), { type: 'image/png' };
      //set the filename
      a.download = 'canvas.png';
      //append download to body
      document.body.appendChild(a);
      //execute click event on element
      a.click();
      // Remove anchor from body
      document.body.removeChild(a);
    }
    if (type === 'UPLOAD') {
      const options = {
        method: 'POST',
        url: '/api/uploadScreenshot',
        data: {
          canvasID: window.location.href.split('/canvas/')[1],
          image: screenshotURL
        }
      };

      axios(options)
        .then(data => {
          console.log('uploaded screenshot');
        })
        .catch(err => {
          // Actually show user what went wrong
          console.log(err);
        });
    }
  }

  render() {
    return (
      <Stage width={this.state.width} height={this.state.height}>
        <Layer id="canvas">
          <Rect
            width={this.state.width}
            height={this.state.height}
            fill={'rgba(0, 20, 155, 0.5)'}
            onMouseDown={this.emitNewNode}
          />
          {Object.values(this.state.nodes).map(node => (
            <Node
              key={node.id}
              id={node.id}
              type={node.type}
              placeNode={this.placeNode}
              color="black"
              canvasWidth={this.state.width}
              canvasHeight={this.state.height}
              x={node.x}
              y={node.y}
              beginNewConnection={this.beginNewConnection}
              emitDeleteNode={this.emitDeleteNode}
              moveNode={this.moveNode}
            />
          ))}
          {Object.keys(this.state.connections).map(id => (
            <RouteLine
              key={id}
              id={id}
              connection={this.state.connections[id]}
              nodes={this.state.nodes}
              handleLineClick={this.handleLineClick}
              handlePointDrag={this.handlePointDrag}
              handleLineDrop={this.handleLineDrop}
              handleDelete={this.deleteConnection}
            />
          ))}
          <Toolbar
            canvasHeight={this.state.height}
            canvasWidth={this.state.width}
            prepNewNode={this.prepNewNode}
            processScreenshot={this.processScreenshot}
          />
        </Layer>
      </Stage>
    );
  }
}

export default Canvas;
