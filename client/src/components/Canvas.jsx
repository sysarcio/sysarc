import React, { Component } from 'react';
import io from 'socket.io-client';
import { Stage, Layer, Rect } from 'react-konva';
import Konva from 'konva';
import axios from 'axios';

import Node from './Node.jsx';
import RouteLine from './RouteLine.jsx';

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: 800,
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

    this.socket.on('node moved', data => {
      this.updateNode(data);
    });

    this.socket.on('connection made', data => {
      this.handleNewConnection(data);
    });

    this.socket.on('connection dragged', data => {
      this.updateConnection(data);
    });

    this.moveNode = this.moveNode.bind(this);
    this.updateNode = this.updateNode.bind(this);
    this.beginNewConnection = this.beginNewConnection.bind(this);
    this.handleNewConnection = this.handleNewConnection.bind(this);
    this.handleLineClick = this.handleLineClick.bind(this);
    this.handlePointDrag = this.handlePointDrag.bind(this);
    this.updateConnection = this.updateConnection.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', () => {
      this.setState({
        width: window.innerWidth,
        height: window.innerHeight
      })
    });
  }

  async getRoomData() {
    const options = {
      url: `/api/getRoomData/${this.roomID}`,
      method: 'GET'
    };

    try {
      const {data} = await axios(options);
      const {nodes, connections} = data
      this.setState({
        nodes,
        connections
      })
    } catch(err) {
      console.log(err);
    }
  }

  beginNewConnection(connectee) {
    const {connector, nodes} = this.state;
    if (connector !== connectee) {
      if (connector) {
        const data = {
          connector: connector,
          connectee: connectee,
          handleX: nodes[connector].x + 150 + 75,
          handleY: ((nodes[connector].y + 75 + nodes[connectee].y + 75) / 2) + 75
        }

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

  updateConnection({id, handleX, handleY}) {
    const connections = JSON.parse(JSON.stringify(this.state.connections));
    connections[id].handleX = handleX;
    connections[id].handleY = handleY;

    this.setState({
      connections
    });
  }

  handleLineClick([x, y]) {
    console.log(x, y);
  }

  handlePointDrag(data) {
    data.room = this.roomID;
    this.socket.emit('drag connection', data);
  }

  moveNode(data) {
    data.room = this.props.match.params.name;
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

  render() {
    return (
      <Stage
        width={this.state.width}
        height={this.state.height}
      >
        <Layer>
        <Rect
          width={this.state.width}
          height={this.state.height}
          fill={'rgba(0, 20, 155, 0.5)'}
        />
        {Object.values(this.state.nodes).map(node => (
            <Node
              key={node.id}
              id={node.id}
              type={node.type}
              updateNode={this.updateNode}
              color="black"
              canvasWidth={this.state.width}
              canvasHeight={this.state.height}
              beginNewConnection={this.beginNewConnection}
              x={node.x}
              y={node.y}
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
            />
          ))}
        </Layer>
      </Stage>
    );
  }
}

export default Canvas;