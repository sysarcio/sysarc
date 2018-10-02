import React, { Component } from 'react'
import ReactDOM from 'react-dom';

class Client extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x: this.props.x,
      y: this.props.y,
      
    }
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  handleMouseDown(e) {
    this.coords = {
      x: e.pageX,
      y: e.pageY
    }
    document.addEventListener('mousemove', this.handleMouseMove);
  }

  handleMouseUp() {
    document.removeEventListener('mousemove', this.handleMouseMove);
    this.coords = {};
    const data = {
      id: this.props.id,
      position: {
        x: this.state.x,
        y: this.state.y
      },
      type: 'client'
    };

    this.props.handleMovement(data);
  }

  handleMouseMove(e) {
    const xDiff = this.coords.x - e.pageX;
    const yDiff = this.coords.y - e.pageY;

    this.coords.x = e.pageX;
    this.coords.y = e.pageY;

    // console.log(this.props.id);
    this.setState({
      x: this.state.x - xDiff,
      y: this.state.y - yDiff
    });
  }



  render() {

    console.log('x and y coordinates-->', this.state.x, this.state.y)
    const { x, y } = this.state;
    return (

      <g>

        <rect
          x={x}
          y={y}
          width="100"
          height="100"
          fill="yellow"
          onMouseDown={this.handleMouseDown.bind(this)}
          onMouseUp={this.handleMouseUp.bind(this)}
        />
        <text x={x + 45} y={y + 55}>Client</text>

      </g>
    )
  }
}


export default Client;