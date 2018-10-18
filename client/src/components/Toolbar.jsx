import React, { Component } from 'react';
import { Rect, Text, Group, Circle, Line } from 'react-konva';
import Konva from 'konva';

const toolbarProperties = {
  width: 150,
  height: 150,
  strokeWidth: 1,
  fill: "#aacfe4",
  
};

const textProperties = {
  width: 150,
  height: 100,
  fill: '#fff',
  align: 'center',
  y: 20
};

const nodeTypes = ['CLIENT', 'SERVER', 'DATABASE', 'SERVICES', 'MISC'];

class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.handleDragBounds = this.handleDragBounds.bind(this);
  }

  handleDragBounds(pos) {
    let { x, y } = pos;

    if (x < 0) {
      x = 0;
    } else if (x + toolbarProperties.width > window.innerWidth) {
      x = this.props.canvasWidth - toolbarProperties.width;
    }

    if (y < 0) {
      y = 0;
    } else if (y + toolbarProperties.height > window.innerHeight) {
      y = this.props.canvasHeight - toolbarProperties.height;
    }

    return { x, y };
  }

  render() {
    return (
      <Group draggable={true} dragBoundFunc={this.handleDragBounds}>
        <Rect
          cornerRadius={15}
          width={toolbarProperties.width}
          height={toolbarProperties.height}
          fill={toolbarProperties.fill}
          strokeWidth={toolbarProperties.strokeWidth}
        />
        {nodeTypes.map((type, i) => (
          <Text
            key={i}
            onClick={() => this.props.prepNewNode(type)}
            text={`+ ${type}`}
            fill={textProperties.fill}
            width={textProperties.width}
            align={textProperties.align}
            fontSize={16}
            y={textProperties.y * (i + 1)}
          />
        ))}
      </Group>
    );
  }
}

export default Toolbar;
