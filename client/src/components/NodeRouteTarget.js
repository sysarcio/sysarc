import React, { Component } from 'react';
import { Circle } from 'react-konva';
import Konva from 'konva';

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
        stroke={this.state.isHovered ? "yellow" : "transparent"}
        strokeWidth={1}
        x={this.props.x}
        y={this.props.y}
        fill="#3d3a3a"
        onClick={this.props.handleCircleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      />
    );
  }
}

export default NodeRouteTarget;