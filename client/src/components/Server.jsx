import React, { Component } from 'react';
import Endpoint from './Endpoint.jsx';
import NewEndpoint from './NewEndpoint.jsx';

class Server extends Component {
  constructor(props) {
    super(props);
    this.state = {
      x: null,
      y: null
    };

    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    // this.toggleSize = this.toggleSize.bind(this);
    // this.toggleAddRoute = this.toggleAddRoute.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (this.state.isOpen !== nextState.isOpen || 
      JSON.stringify(this.props) !== JSON.stringify(nextProps))
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
      id: this.props.node.id
    };

    this.props.handleMovement(data);
  }

  render() {
    const {node} = this.props;
    console.log(`rendering db ${node.id}`);

    return (
      <div
        id={node.id}
        style={{
          background: 'gray',
          color: "#fff", 
          width: '100px',
          height: '100px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          top: node.y,
          left: node.x
        }}
        draggable="true"
        className="node"
        onDragStart={this.handleDragStart}
        onDragEnd={this.handleDragEnd}
        onClick={this.toggleSize}
      >
        <p style={{textAlign: 'center'}} onClick={this.toggleSize}>SERVER</p>
        <button type="button" className="delete-node" onClick={() => this.props.handleDelete({ id: node.id })}>Delete</button>
      </div>
    )
  }
}

export default Server;