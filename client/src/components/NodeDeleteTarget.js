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
      <Group>
        <Line
          visible={
            this.props.parentHovered || this.state.isHovered ? true : false
          }
          points={[7, 7, 17, 17]}
          stroke={this.state.isHovered ? '#EED463' : 'black'}
          strokeWidth={2}
        />
        <Line
          visible={
            this.props.parentHovered || this.state.isHovered ? true : false
          }
          points={[17, 7, 7, 17]}
          stroke={this.state.isHovered ? '#EED463' : 'black'}
          strokeWidth={2}
        />
        <Circle
          x={12}
          y={12}
          radius={7}
          visible={true}
          stroke={'transparent'}
          strokeWidth={1}
          fill={'transparent'}
          onClick={() => this.props.emitDeleteNode(this.props.id)}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        />
      </Group>
    );
  }
}

export default NodeDeleteTarget;
