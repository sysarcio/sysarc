import React, { Component } from 'react';
import { Rect, Text, Group, Circle, Line } from 'react-konva';
import Konva from 'konva';

import NodeShape from './NodeShape.jsx';
import NodeRouteTarget from './NodeRouteTarget.jsx';
import NodeText from './NodeText.jsx';

const nodeProperties = {
  width: 150,
  height: 150
}

class Node extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };

    this.handleDragBounds = this.handleDragBounds.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleCircleClick = this.handleCircleClick.bind(this);
  }

  handleCircleClick() {
    this.props.beginNewConnection(this.props.id);
  }

  trackMouse(e) {
    console.log(e);
  }

  handleDragEnd(e) {
    const {x, y} = e.target.attrs;
    this.props.placeNode({
      x,
      y,
      id: this.props.id
    });
  }

  handleDragBounds(pos) {
    let {x, y} = pos

    if (x < 0) {
      x = 0
    } else if (x + this.props.width > window.innerWidth) {
      x = this.props.canvasWidth - nodeProperties.width
    }

    if (y < 0) {
      y = 0;
    } else if (y + this.props.height > window.innerHeight) {
      y = this.props.canvasHeight - nodeProperties.height
    }

    this.props.moveNode({
      x,
      y,
      id: this.props.id
    });

    return {x, y};
  }

  render() {
    return (
      <Group
        onDragEnd={this.handleDragEnd}
        draggable={true}
        dragBoundFunc={this.handleDragBounds}
        x={this.props.x}
        y={this.props.y}
      >
        <NodeShape
          color={this.props.color}
        />
        <NodeRouteTarget
          x={nodeProperties.width}
          y={nodeProperties.height / 2}
          handleCircleClick={this.handleCircleClick}
        />
        <NodeText
          text={this.props.type}
        />
      </Group>
    );
  }
}

export default Node;