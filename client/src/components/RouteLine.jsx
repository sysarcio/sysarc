import React, { Component } from 'react';
import { Group, Circle, Line } from 'react-konva';
import Konva from 'konva';

import RouteForm from './RouteForm.jsx';

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
    this.props.handlePointDrag({
      id: this.props.id,
      handleX: e.evt.x,
      handleY: e.evt.y
    });
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
    this.props.handleLineDrop({
      id: this.props.id,
      handleX: e.evt.x,
      handleY: e.evt.y,
      data: this.props.connection.data
    });
  }

  render() {
    const { nodes } = this.props;
    const {
      connectee,
      connector,
      connecteeLocation,
      connectorLocation,
      handleX,
      handleY
    } = this.props.connection;
    const positions = {
      connectorRight: [nodes[connector].x + 157, nodes[connector].y + 75],
      connectorLeft: [nodes[connector].x - 7, nodes[connector].y + 75],
      connecteeRight: [nodes[connectee].x + 157, nodes[connectee].y + 75],
      connecteeLeft: [nodes[connectee].x - 7, nodes[connectee].y + 75]
    };

    const connectorPoints =
      connectorLocation === 'left'
        ? positions.connectorLeft
        : positions.connectorRight;
    const connecteePoints =
      connecteeLocation === 'left'
        ? positions.connecteeLeft
        : positions.connecteeRight;

    return (
      <Group
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onDblClick={() => this.props.handleDelete(this.props.id)}
        onClick={() => this.props.toggleOpenConnection(this.props.connection)}
      >
        <Line
          points={[...connectorPoints, handleX, handleY, ...connecteePoints]}
          stroke="transparent"
          strokeWidth={20}
          tension={1}
          bezier
        />
        <Line
          points={[...connectorPoints, handleX, handleY, ...connecteePoints]}
          stroke={this.state.isHovered ? 'yellow' : 'black'}
          strokeWidth={1}
          tension={1}
          bezier
        />
        {this.state.isHovered ? (
          <Circle
            radius={7}
            stroke={'yellow'}
            strokeWidth={1}
            x={handleX}
            y={handleY}
            fill="black"
            draggable={true}
            onDragMove={this.handleLineDrag}
            onDragEnd={this.handleLineDrop}
          />
        ) : null}
      </Group>
    );
  }
}

export default RouteLine;
