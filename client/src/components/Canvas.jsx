import React, { Component } from 'react';
import io from 'socket.io-client';
import { Stage, Layer, Rect, Group } from 'react-konva';
import Konva from 'konva';
import axios from 'axios';

import Toolbar from './Toolbar.jsx';
import Node from './Node.jsx';
import RouteLine from './RouteLine.jsx';
import RouteForm from './RouteForm.jsx';
import dummyData from './dummyDataForReact.jsx';

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
      nodes: {},
      showMenu: true,
      changingNodeType: false,
      miscNodeName: ''
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

    this.socket.on('request screenshot', data => {
      this.processScreenshot('UPLOAD');
    });

    this.updateNode = this.updateNode.bind(this);
    this.beginNewConnection = this.beginNewConnection.bind(this);
    this.handleNewConnection = this.handleNewConnection.bind(this);
    this.handleDeleteConnection = this.handleDeleteConnection.bind(this);
    this.updateConnection = this.updateConnection.bind(this);
    this.emitDeleteNode = this.emitDeleteNode.bind(this);
    this.prepNewNode = this.prepNewNode.bind(this);
    this.emitNewNode = this.emitNewNode.bind(this);
    this.handleNewNode = this.handleNewNode.bind(this);
    this.processScreenshot = this.processScreenshot.bind(this);
    this.toggleOpenConnection = this.toggleOpenConnection.bind(this);
    this.emitUpdateConnectionData = this.emitUpdateConnectionData.bind(this);
    this.handlePathChange = this.handlePathChange.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', () => {
      this.setState({
        width: window.innerWidth,
        height: window.innerHeight
      });
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

  beginNewConnection(connectee, location) {
    const { connector, nodes, connectorLocation } = this.state;
    if (connector !== connectee) {
      // const addToConnectorX = connectorLocation === 'left' ? -25 / this.width : 150 / this.width;
      // const addToConnecteeX = location === 'left' ? -25 / this.width : 150 / this.width;
      if (connector) {
        const data = {
          connector,
          connectee,
          connectorLocation,
          connecteeLocation: location,
          handleX: (nodes[connector].x + nodes[connectee].x) / 2,
          handleY: (nodes[connector].y + nodes[connectee].y) / 2,
          data: {
            '': {
              get: {},
              post: {},
              put: {},
              delete: {}
            }
          }
        };

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

  updateConnection({ id, handleX, handleY }) {
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

  handleDeleteConnection(id) {
    const connections = JSON.parse(JSON.stringify(this.state.connections));
    delete connections[id];
    this.setState({ connections });
  }

  prepNewNode(type) {
    if (type === 'MISC') {
      this.setState({
        changingNodeType: true
      });
    } else {
      this.setState(
        {
          nodeToAdd: type
        },
        () => {
          document.body.style.cursor = 'crosshair';
        }
      );
    }
  }

  emitNewNode(e) {
    if (this.state.nodeToAdd) {
      const x = e.evt.x / this.state.width;
      const y = e.evt.y / this.state.height;
      const data = {
        x,
        y,
        type: this.state.nodeToAdd,
        room: this.roomID
      };
      this.socket.emit('add node', data);

      this.setState(
        { nodeToAdd: null },
        () => (document.body.style.cursor = 'default')
      );
    }
  }

  handleNewNode(node) {
    const nodes = JSON.parse(JSON.stringify(this.state.nodes));
    nodes[node.id] = node;

    this.setState({ nodes });
  }

  updateNode(data) {
    const newNodes = JSON.parse(JSON.stringify(this.state.nodes));
    newNodes[data.id].x = data.x;
    newNodes[data.id].y = data.y;
    this.setState({ nodes: newNodes });
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
    this.setState(
      {
        showMenu: false
      },
      () => {
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
              // console.log('uploaded screenshot');
            })
            .catch(err => {
              // Actually show user what went wrong
              // console.log(err);
            });
        }
        this.setState({
          showMenu: true
        });
      }
    );
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

  handlePathChange(e) {
    e.preventDefault();
    this.setState({
      miscNodeName: e.target.value
    });
  }

  emitUpdateConnectionData(data) {
    data.room = this.roomID;
    this.socket.emit('update connection data', data);
  }
  render() {
    return (
      <div>
        <div id="canvas">
          <Stage
            width={this.state.width * 0.75}
            height={this.state.height * 0.75}
          >
            <Layer className="canvas">
              <Rect
                width={this.state.width * 0.75}
                height={this.state.height * 0.75}
                fill={'rgba(0, 20, 155, 0.5)'}
                onMouseDown={this.emitNewNode}
              />
              {Object.values(this.state.nodes).map(node => (
                <Node
                  key={node.id}
                  node={node}
                  room={this.roomID}
                  socket={this.socket}
                  color="black"
                  canvasWidth={this.state.width}
                  canvasHeight={this.state.height}
                  scale={Math.min(
                    this.state.height * 0.2,
                    this.state.width * 0.2
                  )}
                  beginNewConnection={this.beginNewConnection}
                  emitDeleteNode={this.emitDeleteNode}
                />
              ))}
              {Object.keys(this.state.connections).map(id => (
                <RouteLine
                  key={id}
                  id={id}
                  room={this.roomID}
                  connection={this.state.connections[id]}
                  nodes={this.state.nodes}
                  socket={this.socket}
                  toggleOpenConnection={this.toggleOpenConnection}
                  nodeScale={Math.min(
                    this.state.height * 0.2,
                    this.state.width * 0.2
                  )}
                  canvasHeight={this.state.height}
                  canvasWidth={this.state.width}
                />
              ))}
              {this.state.showMenu ? (
                <Toolbar
                  canvasHeight={this.state.height}
                  canvasWidth={this.state.width}
                  prepNewNode={this.prepNewNode}
                  processScreenshot={this.processScreenshot}
                />
              ) : null}
            </Layer>
          </Stage>
        </div>
        {this.state.openConnection ? (
          <RouteForm
            room={this.roomID}
            socket={this.socket}
            connection={this.state.openConnection}
            // data={dummyData}
            data={
              Object.keys(this.state.openConnection.data)[0]
                ? this.state.openConnection.data
                : { '': {} }
            }
            // pathName={Object.keys(dummyData)[0]}
            pathName={Object.keys(this.state.openConnection.data)[0]}
            toggleOpenConnection={this.toggleOpenConnection}
            emitUpdateConnectionData={this.emitUpdateConnectionData}
            canvasHeight={this.state.height}
            canvasWidth={this.state.width}
          />
        ) : null}

        {this.state.changingNodeType ? (
          <div>
            <form
              onSubmit={e => {
                e.preventDefault();
                this.setState({
                  changingNodeType: false,
                  miscNodeName: ''
                });
                this.prepNewNode(this.state.miscNodeName);
              }}
            >
              <input
                className="noStyle"
                type="text"
                placeholder="Enter type of node"
                value={this.state.miscNodeName}
                onChange={this.handlePathChange}
                style={{ width: '20%' }}
              />
              <button>submit</button>
            </form>
          </div>
        ) : null}
      </div>
    );
  }
}

export default Canvas;
