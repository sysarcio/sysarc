import React, { Component } from 'react';
import { Rect, Text, Group, Circle, Line } from 'react-konva';
import Konva from 'konva';

// TODO: properties
// const nodeProperties = {
//   width: 150,
//   height: 150,
//   strokeWidth: 1,
//   fill: "rgba(255, 255, 255, 0.2)"
// }

class NodeRouteTarget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHovered: false
    };

    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
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
      isHovered: false
    })
  }

  render() {
    return (
      <Circle
        radius={7}
        stroke={this.state.isHovered ? "yellow" : "black"}
        strokeWidth={1}
        x={this.props.x}
        y={this.props.y}
        fill="black"
        onClick={this.props.handleCircleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      />
    );
  }
}

export default NodeRouteTarget;