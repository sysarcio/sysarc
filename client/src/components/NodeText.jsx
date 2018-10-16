import React, { Component } from 'react';
import { Rect, Text, Group, Circle, Line } from 'react-konva';
import Konva from 'konva';

const textProperties = {
  fill: "#fff",
  align: "center",
  y: 15
}

class NodeText extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <Text
        text={this.props.text}
        fill={textProperties.fill}
        width={this.props.scale}
        align={textProperties.align}
        fontSize={16}
        y={textProperties.y}
      />
    );
  }
}

export default NodeText;