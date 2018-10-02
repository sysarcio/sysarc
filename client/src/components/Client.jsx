import React, { Component } from 'react'
import ReactDOM from 'react-dom';

class Client extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x: this.props.x,
      y: this.props.y,
      id: this.props.id,
      text: 'Client',
      endpoints: ['/api/goals'],
      isHidden: true
    }
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.toggleHidden = this.toggleHidden.bind(this);
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

  toggleHidden() {
    console.log('im hiding')
    this.setState({
      isHidden: !this.state.isHidden
    })
  }


  render() {
    const endpointStyle = {
      // 'display': 
    }
    // console.log('x and y coordinates-->', this.state.x, this.state.y);
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
          onDoubleClick={()=> this.props.handleDelete({id: this.state.id})}
        />
        <text x={x + 45} y={y + 55}>{this.state.text}</text>
        <foreignObject x={x + 25} y={y + 70} width="100" height="100">
          {!this.state.isHidden && <input className='endpointInput'></input>}    
        </foreignObject>
        <foreignObject x={x} y={y} width="15" height="15">
          <button onClick={this.toggleHidden}>+</button>
        </foreignObject>
        
      </g>
    )
  }
}


export default Client;