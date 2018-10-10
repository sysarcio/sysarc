import React, { Component } from 'react';
import Endpoint from './Endpoint.jsx';
import NewEndpoint from './NewEndpoint.jsx';
import Draggable from 'react-draggable';

class Client extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      parent: null,
      x: null,
      y: null,
      isAddingRoute: false
    };

    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.toggleSize = this.toggleSize.bind(this);
    this.toggleAddRoute = this.toggleAddRoute.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(this.props) !== JSON.stringify(nextProps)
  }

  handleDragStart(e) {
    
  }

  handleDragEnd(e) {
    // e.target.style.opacity = 1;
    const rect = document.getElementById(this.props.node.id).getBoundingClientRect();
    
    const data = {
      position: {
        x: rect.x,
        y: rect.y
      },
      id: this.props.node.id
    };

    this.props.handleMovement(data);
  }

  toggleAddRoute() {
    this.setState({
      isAddingRoute:!this.state.isAddingRoute
    });
  }

  toggleSize(e) {
    if (e.target === e.currentTarget) {
      this.setState({
        isOpen: !this.state.isOpen
      });
    }
  }

  render() {
    console.log(`rendering client ${this.props.node.id}`);
    const {node} = this.props;

    return (
      <g>
        <foreignObject
          width={this.state.isOpen ? "350px" : "100px"}
          height={this.state.isOpen ? "250px" : "100px"}
          x={node.x}
          y={node.y}
          className="node-container"
        >
          <div
            id={this.props.node.id}
            style={{background: '#fff', width: '100%', height: '100%', border: '1px solid #ccc', borderRadius: '5px'}}
            className="node client"
            draggable="true"
            onDragEnd={this.handleDragEnd}
          >
          </div>
        </foreignObject>
      </g>
    )
  }
}

export default Client;