import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import Endpoint from './Endpoint.jsx';

class Client extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      parent: null,
      x: null,
      y: null
    };

    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.toggleSize = this.toggleSize.bind(this);
  }

  handleDragStart(e) {
    e.target.style.opacity = 0.5;

    this.setState({
      parent: e.target.parentElement,
      x: e.clientX - e.target.parentElement.x.baseVal.value,
      y: e.clientY - e.target.parentElement.y.baseVal.value
    });
  }

  handleDragEnd(e) {
    e.target.style.opacity = 1;
    
    const data = {
      position: {
        x: e.clientX - this.state.x,
        y: e.clientY - this.state.y
      },
      id: this.props.get(this.props.node, 'id')
    };

    this.props.handleMovement(data);
  }

  toggleSize(e) {
    if (e.target === e.currentTarget) {
      this.setState({
        isOpen: !this.state.isOpen
      });
    }
  }

  render() {
    const node = this.props.node;
    console.log(node);
    // console.log(node, '------>', node.x, node.y);

    return (
      <g>
        <foreignObject
          x={this.props.get(node, 'x')}
          y={this.props.get(node, 'y')}
          width={this.state.isOpen ? "250px" : "100px"}
          height={this.state.isOpen ? "250px" : "100px"}
          className="client-container"
        >
          <div
            id={this.props.get(node, 'id')}
            style={{background: '#fff', width: '100%', height: '100%', border: '1px solid #ccc', borderRadius: '5px'}}
            draggable="true"
            className="client"
            onDragStart={this.handleDragStart}
            onDragEnd={this.handleDragEnd}
            onClick={this.toggleSize}
          >
          <p style={{textAlign: 'center'}}>CLIENT</p>
          {/* {this.state.isOpen ? 
            node.routes.map((endpoint, i) => (
              <Endpoint
                key={i}
                endpoint={endpoint}
                handleRouteDelete={this.props.handleRouteDelete}
                handleRouteUpdate={this.props.handleRouteUpdate}
              />
            ))
          :
            null
          } */}
          </div>
        </foreignObject>
      </g>
    )
  }
}

export default Client;