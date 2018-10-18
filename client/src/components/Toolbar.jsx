import React, { Component } from 'react';
import { Rect, Text, Group, Circle, Line } from 'react-konva';
import Konva from 'konva';
import dummyData from './dummyDataForReact.jsx'

const toolbarProperties = {
  width: 175,
  height: 175,
  strokeWidth: 1,
  fill: 'rgba(255, 255, 255, 0.2)'
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

        <Text
          onClick={this.props.takeMeToTheDocs}
          json={dummyData}
          fontSize={16}
          text="+ DOCS"
          fill={textProperties.fill}
          width={textProperties.width}
          align={textProperties.align}
          y={textProperties.y * (nodeTypes.length+screenshotTypes.length + 1)}
        />
      </Group>
    );
  }
}

export default Toolbar;
