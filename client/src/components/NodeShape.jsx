import React, { Component } from 'react';
import { Rect, Text, Group, Circle, Line } from 'react-konva';
import Konva from 'konva';

const nodeProperties = {
  strokeWidth: 1,
  fill: "#aacfe4",
  borderRadius: '15px',
  
}

class NodeShape extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Rect
        cornerRadius={15}
        width={this.props.nodeWidth}
        height={this.props.nodeHeight}
        fill={nodeProperties.fill}
        stroke={this.props.color}
        strokeWidth={nodeProperties.strokeWidth}
        cornerRadius={15}
      />
    );
  }
}

export default NodeShape;
