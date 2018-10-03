import React, { Component } from 'react'
import ReactDOM from 'react-dom';

class Client extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x: this.props.x,
      y: this.props.y,
      id: this.props.id,
      endpoints: ['/api/goals'],
      isHidden: true,
      getText: ''
    }

    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.toggleHidden = this.toggleHidden.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
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
      type: 'CLIENT'
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
    this.setState({
      isHidden: !this.state.isHidden
    })
  }

  handleGetText(e) {
    this.setState({
      getText: e.target.value
    })
  }

  render() {
    console.log('text', this.state.getText)

    // console.log('x and y coordinates-->', this.state.x, this.state.y);
    const {x, y} = this.state;
    return (

      <g>

        <rect
          x={x}
          y={y}
          width="100"
          height="100"
          fill="yellow"
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          onDoubleClick={()=> this.props.handleDelete({id: this.state.id})}
        />
        <text x={x + 45} y={y + 55}>Client</text>
        <foreignObject x={x + 10} y={y + 70} width="250" height="250">

          {!this.state.isHidden && 
            <div> 
              Get: <input 
                      placeholder='Enter endpoint details' 
                      value={this.state.getText} 
                      onChange={this.handleGetText.bind(this)}>
                    </input>    
            <button 
              onClick={() => this.props.handleRouteText({ id: this.state.id, route: 'GET', text: this.state.getText})}>Update</button>
            </div>
          }
        </foreignObject>
        <foreignObject x={x} y={y} width="15" height="15">
          <button onClick={this.toggleHidden}>+</button>
        </foreignObject>
        
      </g>
    )
  }
}


export default Client;