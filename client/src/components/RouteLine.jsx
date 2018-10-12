import React, { Component } from 'react';
import { Group, Circle, Line } from 'react-konva';
import Konva from 'konva';

class RouteLine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHovered: false,
    };

    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleLineDrag = this.handleLineDrag.bind(this);
    this.handleLineDrop = this.handleLineDrop.bind(this);
  }

  handleLineDrag(e) {
    this.props.handlePointDrag({
      id: this.props.id,
      handleX: e.evt.x,
      handleY: e.evt.y
    });
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

  handleLineDrop(e) {
    this.props.handleLineDrop({
      id: this.props.id,
      handleX: e.evt.x,
      handleY: e.evt.y,
      description: this.props.connection.description
    });
  }

  render() {
    const {nodes} = this.props;
    const {connectee, connector, handleX, handleY} = this.props.connection;

    return (
      <Group
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <Line
          points={[
            nodes[connector].x + 157, nodes[connector].y + 75,
            handleX, handleY,
            nodes[connectee].x + 157, nodes[connectee].y + 75
          ]}
          stroke='transparent'
          strokeWidth={20}
          tension={1}
          onClick={() => this.props.handleLineClick([nodes[connector].x + 150 + 75, ((nodes[connector].y + 75 + nodes[connectee].y + 75) / 2) + 75])}
          bezier
        />
        <Line
          points={[
            nodes[connector].x + 150, nodes[connector].y + 75,
            handleX, handleY,
            nodes[connectee].x + 150, nodes[connectee].y + 75,
          ]}
          stroke={this.state.isHovered ? 'yellow' : 'black'}
          strokeWidth={1}
          tension={1}
          bezier
        />
        {this.state.isHovered ? 
          <Circle
            radius={7}
            stroke={"yellow"}
            strokeWidth={1}
            x={handleX}
            y={handleY}
            fill="black"
            draggable={true}
            onDragMove={this.handleLineDrag}
            onDragEnd={this.handleLineDrop}
          />
        :
          null
        }
      </Group>
    );
  }
}

export default RouteLine;