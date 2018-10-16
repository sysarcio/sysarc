import React, { Component } from 'react';
import { Rect, Text, Group, Circle, Line } from 'react-konva';
import Konva from 'konva';

import NodeShape from './NodeShape.jsx';
import NodeRouteTarget from './NodeRouteTarget.jsx';
import NodeText from './NodeText.jsx';

// const nodeProperties = {
//   width: 150,
//   height: 150
// }

class Node extends Component {
  constructor(props) {
    super(props);
<<<<<<< HEAD

    this.state = {
      dragX: null,
      dragY: null
    };
=======
>>>>>>> dev

    this.handleDragBounds = this.handleDragBounds.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleCircleClick = this.handleCircleClick.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleDragState = this.handleDragState.bind(this);
  }

  handleDragState(e) {
    const {x, y} = e.target.attrs;
    this.setState({
      dragX: x,
      dragY: y
    });
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
    let {x, y} = e.target.attrs;
    x = x / this.props.canvasWidth;
    y = y / this.props.canvasHeight;
    this.props.placeNode({
      x,
      y,
      id: this.props.id
    });

    this.setState({
      dragX: null,
      dragY: null
    });
  }

  handleDragBounds({x, y}) {
    if (x < 0) {
      x = 0;
    } else if (x + this.props.scale > this.props.canvasWidth) {
      x = this.props.canvasWidth - this.props.scale;
    }

    if (y < 0) {
      y = 0;
    } else if (y + this.props.scale > this.props.canvasHeight) {
      y = this.props.canvasHeight - this.props.scale
    }

    x = x / this.props.canvasWidth;
    y = y / this.props.canvasHeight;

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
<<<<<<< HEAD
        x: this.props.scale,
        y: this.props.scale / 2
=======
        x: nodeProperties.width,
        y: nodeProperties.height / 2
>>>>>>> dev
      },
      // bottom: {
      //   x: nodeProperties.width / 2,
      //   y: nodeProperties.height
      // },
      left: {
        x: 0,
<<<<<<< HEAD
        y: this.props.scale / 2
      }
    };

    let x = this.dragX ? this.dragX : this.props.x * this.props.canvasWidth;
    let y = this.dragY ? this.dragY : this.props.y * this.props.canvasHeight;

=======
        y: nodeProperties.height / 2
      }
    };

>>>>>>> dev
    return (
      <Group
        onDragEnd={this.handleDragEnd}
        onDblClick={() => this.props.emitDeleteNode(this.props.id)}
        draggable={true}
        onDragMove={this.handleDragState}
        dragBoundFunc={this.handleDragBounds}
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
            color={this.props.color}
          />
          <NodeText
            scale={this.props.scale}
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