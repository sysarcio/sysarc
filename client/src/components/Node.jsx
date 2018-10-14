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

    this.handleDragBounds = this.handleDragBounds.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleCircleClick = this.handleCircleClick.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  handleCircleClick(target) {
    this.props.beginNewConnection(this.props.id, target);
  }

  handleMouseEnter(e) {
    document.body.style.cursor = 'move';
  }

  handleMouseLeave(e) {
    document.body.style.cursor = 'default';
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
    const nodeRouteTargets = {
      // top: {
      //   x: nodeProperties.width / 2,
      //   y: 0
      // },
      right: {
        x: nodeProperties.width,
        y: nodeProperties.height / 2
      },
      // bottom: {
      //   x: nodeProperties.width / 2,
      //   y: nodeProperties.height
      // },
      left: {
        x: 0,
        y: nodeProperties.height / 2
      }
    };

    return (
      <Group
        onDragEnd={this.handleDragEnd}
        onDblClick={() => this.props.emitDeleteNode(this.props.id)}
        draggable={true}
        dragBoundFunc={this.handleDragBounds}
        x={this.props.x}
        y={this.props.y}
      >
        <Group
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        >
          <NodeShape
            color={this.props.color}
          />
          <NodeText
            text={this.props.type}
          />
        </Group>
        {Object.keys(nodeRouteTargets).map((target, i) => (
          <NodeRouteTarget
            key={i}
            x={nodeRouteTargets[target].x}
            y={nodeRouteTargets[target].y}
            handleCircleClick={() => this.handleCircleClick(target)}
          />
        ))}
      </Group>
    );
  }
}

export default Node;