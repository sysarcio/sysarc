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
  }

  handleLineDrag(e) {
    let {x, y} = e.evt;
    x = x / this.props.canvasWidth;
    y = y / this.props.canvasHeight;
    this.props.handlePointDrag({
      id: this.props.id,
      handleX: x,
      handleY: y
    });
  }

  handleMouseEnter() {
    document.body.style.cursor = 'pointer';
    this.setState({
      isHovered: true
    })
  }

  handleMouseLeave() {
    document.body.style.cursor = 'default';
    this.setState({
      isHovered: false,
      formIsOpen: false
    });
  }

  handleLineDrop(e) {
    let {x, y} = e.evt;
    x = x / this.props.canvasWidth;
    y = y / this.props.canvasHeight;
    this.props.handleLineDrop({
      id: this.props.id,
      handleX: x,
      handleY: y,
      data: this.props.connection.data
    });
  }

  render() {
    const {nodes, canvasWidth, canvasHeight, nodeScale} = this.props;
    let {connectee, connector, connecteeLocation, connectorLocation, handleX, handleY} = this.props.connection;
    handleX = handleX * canvasWidth;
    handleY = handleY * canvasHeight;
    const positions = {
      connectorRight: [
        nodes[connector].x * canvasWidth + nodeScale + 7, nodes[connector].y * canvasHeight + (nodeScale / 2)
      ],
      connectorLeft: [
        nodes[connector].x * canvasWidth-7, nodes[connector].y * canvasHeight + (nodeScale / 2)
      ],
      connecteeRight: [
        nodes[connectee].x * canvasWidth + nodeScale + 7, nodes[connectee].y * canvasHeight + (nodeScale / 2)
      ],
      connecteeLeft: [
        nodes[connectee].x * canvasWidth - 7, nodes[connectee].y * canvasHeight + (nodeScale / 2)
      ]
    };

    const connectorPoints = connectorLocation === 'left' ? positions.connectorLeft : positions.connectorRight;
    const connecteePoints = connecteeLocation === 'left' ? positions.connecteeLeft : positions.connecteeRight;

    return (
      <Group
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onDblClick={() => this.props.handleDelete(this.props.id)}
        onClick={() => this.props.toggleOpenConnection(this.props.connection)}
      >
        <Line
          points={[
            ...connectorPoints,
            handleX, handleY,
            ...connecteePoints
          ]}
          stroke='transparent'
          strokeWidth={20}
          tension={1}
          bezier
        />
        <Line
          points={[
            ...connectorPoints,
            handleX, handleY,
            ...connecteePoints
          ]}
          stroke={this.state.isHovered ? 'yellow' : 'black'}
          strokeWidth={1}
          tension={1}
          bezier
        />
        {this.state.isHovered ? 
          <Circle
            radius={7}
            stroke={"yellow"}
            strokeWidth={1}
            x={handleX}
            y={handleY}
            fill="black"
            draggable={true}
            onDragMove={this.handleLineDrag}
            onDragEnd={this.handleLineDrop}
          />
        :
          null
        }
      </Group>
    );
  }
}

export default RouteLine;