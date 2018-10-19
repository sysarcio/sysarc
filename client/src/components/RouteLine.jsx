import React, { Component } from 'react';
import { Group, Circle, Line } from 'react-konva';
import Konva from 'konva';

class RouteLine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHovered: false
    };

    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleLineDrag = this.handleLineDrag.bind(this);
    this.handleLineDrop = this.handleLineDrop.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete() {
    const data = {
      room: this.props.room,
      id: this.props.id
    };
    this.props.socket.emit('delete connection', data);
  }

  handleLineDrag(e) {
    const {offsetX, offsetY} = e.evt;
    let x = offsetX / this.props.canvasWidth;
    let y = offsetY / this.props.canvasHeight;

    const data = {
      id: this.props.id,
      handleX: x,
      handleY: y,
      room: this.props.room
    }

    this.props.socket.emit('drag connection', data);
  }

  handleMouseEnter() {
    document.body.style.cursor = 'pointer';
    this.setState({
      isHovered: true
    });
  }

  handleMouseLeave() {
    document.body.style.cursor = 'default';
    this.setState({
      isHovered: false,
      formIsOpen: false
    });
  }

  handleLineDrop(e) {
    const {offsetX, offsetY} = e.evt;
    let x = offsetX / this.props.canvasWidth;
    let y = offsetY / this.props.canvasHeight;

    const data = {
      id: this.props.id,
      handleX: x,
      handleY: y,
      data: this.props.connection.data,
      room: this.props.room
    }

    this.props.socket.emit('place connection', data);
  }

  render() {
    const {nodes, canvasWidth, canvasHeight, nodeScale, lineCount} = this.props;

    var LINE_LOGIC = {
      1: 'red',
      2: 'blue',
      3: 'green',
      4: 'yellow'
    };
    let lineColor = LINE_LOGIC[lineCount] || 'black';
    const multiplier = lineCount % 2 ? lineCount * 10 : lineCount * -10;
    // console.log('because the number of lines is ', lineCount, ' the color is ', lineColor);

    let {connectee, connector, connecteeLocation, connectorLocation, handleX, handleY} = this.props.connection;
    handleX = handleX * canvasWidth;
    handleY = handleY * canvasHeight;
    const positions = {
      connectorRight: [
        nodes[connector].x * canvasWidth + nodeScale, nodes[connector].y * canvasHeight + (nodeScale / 2),
        (nodes[connector].x * canvasWidth + nodeScale) + 50, nodes[connector].y * canvasHeight + (nodeScale / 2) + multiplier
      ],
      connectorLeft: [
        nodes[connector].x * canvasWidth, nodes[connector].y * canvasHeight + (nodeScale / 2),
        (nodes[connector].x * canvasWidth) - 50, nodes[connector].y * canvasHeight + (nodeScale / 2)
      ],
      connecteeRight: [
        (nodes[connectee].x * canvasWidth + nodeScale) + 50, nodes[connectee].y * canvasHeight + (nodeScale / 2),
        nodes[connectee].x * canvasWidth + nodeScale, nodes[connectee].y * canvasHeight + (nodeScale / 2)
      ],
      connecteeLeft: [
        (nodes[connectee].x * canvasWidth) - 50, nodes[connectee].y * canvasHeight + (nodeScale / 2) + multiplier,
        nodes[connectee].x * canvasWidth, nodes[connectee].y * canvasHeight + (nodeScale / 2)
      ]
      
    };
    positions.transparentConnectorRight = [positions.connectorRight[0] + 15, ...positions.connectorRight.slice(1)];
    positions.transparentConnectorLeft = [positions.connectorLeft[0] - 15, ...positions.connectorLeft.slice(1)];
    positions.transparentConnecteeRight = [positions.connecteeRight[0] + 15, ...positions.connecteeRight.slice(1)];
    positions.transparentConnecteeLeft = [positions.connecteeLeft[0] - 15, ...positions.connecteeLeft.slice(1)];
    
    const connectorPoints = connectorLocation === 'left' ? positions.connectorLeft : positions.connectorRight;
    const connecteePoints = connecteeLocation === 'left' ? positions.connecteeLeft : positions.connecteeRight;
    const transparentConnectorPoints = connectorLocation === 'left' ? positions.transparentConnectorLeft : positions.transparentConnectorRight;
    const transparentConnecteePoints = connecteeLocation === 'left' ? positions.transparentConnecteeLeft : positions.transparentConnecteeRight;

    return (
      <Group
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onDblClick={this.handleDelete}
        onClick={() => this.props.toggleOpenConnection(this.props.connection)}
      >
        <Line
          points={[
            ...transparentConnectorPoints,
            ...transparentConnecteePoints
          ]}
          stroke='transparent'
          strokeWidth={20}
        />
        <Line
          points={[
            ...connectorPoints,
            ...connecteePoints
          ]}
          stroke={this.state.isHovered ? 'yellow' : lineColor}
          strokeWidth={1}
        />
      </Group>
    );
  }
}

export default RouteLine;