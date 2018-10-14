import React, { Component } from 'react';
import io from 'socket.io-client';
import { Stage, Layer, Rect } from 'react-konva';
import Konva from 'konva';
import axios from 'axios';

import Toolbar from './Toolbar.jsx';
import Node from './Node.jsx';
import RouteLine from './RouteLine.jsx';
import RouteForm from './RouteForm.jsx';

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      openConnection: null,
      nodeToAdd: null,
      connector: null,
      connectorLocation: null,
      connections: {},
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

    this.socket.on('connection updated', data => {
      this.handleConnectionUpdated(data);
    });

    this.moveNode = this.moveNode.bind(this);
    this.updateNode = this.updateNode.bind(this);
    this.placeNode = this.placeNode.bind(this);
    this.beginNewConnection = this.beginNewConnection.bind(this);
    this.handleNewConnection = this.handleNewConnection.bind(this);
    this.deleteConnection = this.deleteConnection.bind(this);
    this.handlePointDrag = this.handlePointDrag.bind(this);
    this.handleLineDrop = this.handleLineDrop.bind(this);
    this.handleDeleteConnection = this.handleDeleteConnection.bind(this);
    this.updateConnection = this.updateConnection.bind(this);
    this.emitDeleteNode = this.emitDeleteNode.bind(this);
    this.prepNewNode = this.prepNewNode.bind(this);
    this.emitNewNode = this.emitNewNode.bind(this);
    this.handleNewNode = this.handleNewNode.bind(this);
    this.toggleOpenConnection = this.toggleOpenConnection.bind(this);
    this.emitUpdateConnectionData = this.emitUpdateConnectionData.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', () => {
      this.setState({
        width: window.innerWidth,
        height: window.innerHeight
      })
    });

    window.addEventListener('keyup', e => {
      if (e.keyCode === 27) {
        this.setState({
          openConnection: null,
          nodeToAdd: null,
          connector: null
        });
      }
    });
  }

  async getRoomData() {
    const options = {
      url: `/api/getRoomData/${this.roomID}`,
      method: 'GET'
    };

    try {
      const {data} = await axios(options);
      const {nodes, connections} = data;
      this.setState({
        nodes,
        connections
      });

      console.log(connections);
    } catch(err) {
      console.log(err);
    }
  }

  beginNewConnection(connectee, location) {
    const {connector, nodes, connectorLocation} = this.state;
    if (connector !== connectee) {
      if (connector) {
        const data = {
          connector,
          connectee,
          connectorLocation,
          connecteeLocation: location,
          handleX: nodes[connector].x + 150 + 75,
          handleY: ((nodes[connector].y + 75 + nodes[connectee].y + 75) / 2) + 75,
          data: {}
        }

        data.room = this.roomID;
        this.socket.emit('make connection', data);
  
        this.setState({
          connector: null
        });
      } else {
        this.setState({
          connector: connectee,
          connectorLocation: location
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

  handleConnectionUpdated(connection) {
    const connections = JSON.parse(JSON.stringify(this.state.connections));
    connections[connection.id] = connection;

    this.setState({
      connections
    });
  }

  deleteConnection(id) {
    const data = {
      room: this.roomID,
      id
    }
    this.socket.emit('delete connection', data);
  }

  handleLineDrop(data) {
    console.log(data);
    data.room = this.roomID;
    this.socket.emit('place connection', data);
  }

  handlePointDrag(data) {
    data.room = this.roomID;
    this.socket.emit('drag connection', data);
  }

  handleDeleteConnection(id) {
    const connections = JSON.parse(JSON.stringify(this.state.connections));
    delete connections[id];
    this.setState({connections});
  }

  prepNewNode(type) {
    this.setState({
      nodeToAdd: type
    }, () => {
      document.body.style.cursor = 'crosshair';
    });
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

      this.setState({
        nodeToAdd: null
      }, () => {
        document.body.style.cursor = 'default';
      });
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
    }
    this.socket.emit('delete node', data)
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

  toggleOpenConnection(connection = null) {
    this.setState({
      openConnection: null
    });

    if (connection) {
      this.setState({
        openConnection: connection
      });
    }
  }

  emitUpdateConnectionData(data) {
    data.room = this.roomID;
    this.socket.emit('update connection data', data);
  }

  render() {
    return (
      <div>
        <div
          id="canvas"
        >
          <Stage
            width={this.state.width}
            height={this.state.height}
          >
            <Layer
              className="canvas"
            >
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
                  handlePointDrag={this.handlePointDrag}
                  handleLineDrop={this.handleLineDrop}
                  handleDelete={this.deleteConnection}
                  toggleOpenConnection={this.toggleOpenConnection}
                />
              ))}
              <Toolbar 
                canvasHeight={this.state.height}
                canvasWidth={this.state.width}
                prepNewNode={this.prepNewNode}
              />
            </Layer>
          </Stage>
        </div>
        {this.state.openConnection ?
          <RouteForm
            connection={this.state.openConnection}
            toggleOpenConnection={this.toggleOpenConnection}
            emitUpdateConnectionData={this.emitUpdateConnectionData}
          />
        :
          null
        }
      </div>
    );
  }
}

export default Canvas;