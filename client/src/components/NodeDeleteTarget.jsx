import React, { Component } from 'react';
import { Rect, Text, Group, Circle, Line } from 'react-konva';
import Konva from 'konva';

class NodeDeleteTarget extends Component {
  constructor(props) {
    super(props);
    this.isCancelled = false;
    this.state = {
      isHovered: false
    };

    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  handleMouseEnter() {
    document.body.style.cursor = 'pointer';
    if (!this.isCancelled) {
      this.setState({
        isHovered: true
      });
    }
  }

  handleMouseLeave() {
    document.body.style.cursor = 'default';
    if (!this.isCancelled) {
      this.setState({
        isHovered: false
      });
    }
  }

  componentWillUnmount() {
    this.isCancelled = true;
  }

  render() {
    return (
      <Circle
        x={7}
        y={7}
        radius={7}
        visible={
          this.props.parentHovered || this.state.isHovered ? true : false
        }
        stroke={this.state.isHovered ? 'red' : 'black'}
        strokeWidth={1}
        fill={this.state.isHovered ? 'red' : 'black'}
        onClick={() => this.props.emitDeleteNode(this.props.id)}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      />
    );
  }
}

export default NodeDeleteTarget;
