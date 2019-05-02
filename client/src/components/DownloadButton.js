import React, { Component } from 'react';
import { Circle, Group, Text } from 'react-konva';
import Konva from 'konva';

class DownloadButton extends Component {
  constructor(props) {
    super(props);

    this.state ={
      isHovered: false
    }

    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  handleMouseEnter() {
    document.body.style.cursor = 'pointer';
    this.setState({
      isHovered: true
    });
  }

  handleMouseLeave() {
    document.body.style.cursor = 'default';
    this.setState({
      isHovered: false
    });
  }

  render() {
    return (
      <Group
        x={this.props.canvasWidth * 0.72}
        y={this.props.canvasHeight * 0.7}
        onClick={this.handleClick}
        width={15}
        height={15}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onClick={() => this.props.processScreenshot('DOWNLOAD')}
      >
        <Circle
          radius={15}
          fill={this.state.isHovered ? "rgb(137, 157, 255)" : "rgb(56, 84, 200)"}
          shadowColor={"black"}
          shadowBlur={10}
          shadowOffset={{x: 5, y: 5}}
          shadowOpacity={0.2}
        />
        <Text
          text={"?"}
          fontSize={20}
          fill={this.state.isHovered ? "white" : "rgb(31, 52, 142)"}
          textAlign={"center"}
          x={-5}
          y={-9}
        />
      </Group>
    )
  }
}

export default DownloadButton;