import React, { Component } from 'react';
import { Rect, Text, Group, Circle, Line } from 'react-konva';
import Konva from 'konva';

import NodeShape from './NodeShape.jsx';
import NodeRouteTarget from './NodeRouteTarget.jsx';
import NodeDeleteTarget from './NodeDeleteTarget.jsx';
import NodeText from './NodeText.jsx';

class Node extends Component {
  constructor(props) {
    super(props);

    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleCircleClick = this.handleCircleClick.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleDragState = this.handleDragState.bind(this);
  }

  handleDragState(e) {
    let { x, y } = e.target.attrs;
    
    if (x < 0) {
      x = 0;
    } else if (x + this.props.scale > this.props.canvasWidth) {
      x = this.props.canvasWidth - this.props.scale;
    }

    if (y < 0) {
      y = 0;
    } else if (y + this.props.scale > this.props.canvasHeight) {
      y = this.props.canvasHeight - this.props.scale;
    }

    x = x / this.props.canvasWidth;
    y = y / this.props.canvasHeight;

    const data = {
      x,
      y,
      id: this.props.node.id,
      room: this.props.room
    };

    this.props.socket.emit('move node', data);
  }

  handleCircleClick(target) {
    this.props.beginNewConnection(this.props.node.id, target);
  }

  handleMouseEnter(e) {
    document.body.style.cursor = 'move';
    this.setState({ isHovered: true });
  }

  handleMouseLeave(e) {
    document.body.style.cursor = 'default';
    this.setState({ isHovered: false });
  }

  handleDragEnd(e) {
    let { x, y } = e.target.attrs;
    x = x / this.props.canvasWidth;
    y = y / this.props.canvasHeight;

    const data = {
      x,
      y,
      id: this.props.node.id,
      room: this.props.room
    };

    this.props.socket.emit('place node', data);
  }

  render() {
    let { id, type, x, y } = this.props.node;

    const nodeRouteTargets = {
      right: {
        x: this.props.scale,
        y: this.props.scale / 2
      },
      left: {
        x: 0,
        y: this.props.scale / 2
      }
    };

    x = this.dragX ? this.dragX : x * this.props.canvasWidth;
    y = this.dragY ? this.dragY : y * this.props.canvasHeight;

    return (
      <Group
        onDragEnd={this.handleDragEnd}
        draggable={true}
        onDragMove={this.handleDragState}
        x={x}
        y={y}
      >
        <Group
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        >
          <NodeShape
            nodeWidth={this.props.scale}
            nodeHeight={this.props.scale}
            type={type}
            color={this.props.color}
          />
          <NodeText scale={this.props.scale} text={type} />
        </Group>
        {Object.keys(nodeRouteTargets).map((target, i) => (
          <NodeRouteTarget
            key={i}
            x={nodeRouteTargets[target].x}
            y={nodeRouteTargets[target].y}
            handleCircleClick={() => this.handleCircleClick(target)}
          />
        ))}
        <NodeDeleteTarget
          parentHovered={this.state.isHovered}
          emitDeleteNode={() => this.props.emitDeleteNode(id)}
        />
      </Group>
    );
  }
}

export default Node;
