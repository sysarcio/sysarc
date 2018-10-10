import React, { Component } from 'react';
import $ from 'jquery';
import Draggable from 'react-draggable';
import Endpoint from './Endpoint.jsx';
import NewEndpoint from './NewEndpoint.jsx';

class Client extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };

    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    // this.toggleSize = this.toggleSize.bind(this);
    // this.toggleAddRoute = this.toggleAddRoute.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(this.props) !== JSON.stringify(nextProps)
  }

  handleDragStart(e) {
    // const node = document.getElementById(this.props.node.id);
    // const {top, left} = $(node).offset();
    // console.log(top, left);
  }

  handleDragEnd(e) {
    const node = $(`#${this.props.node.id}`);
    const {top, left} = $(node).offset();
    $(node).hide();
    
    const data = {
      position: {
        x: left,
        y: top
      },
      id: this.props.node.id
    };

    this.props.handleMovement(data);
  }

  render() {
    const {node} = this.props;
    $(`#${node.id}`).show();
    console.log(`rendering db ${node.id}`);

    return (
      <Draggable
        handle='.node-name'
        position={{x: node.x, y: node.y}}
        bounds='parent'
        onStart={this.handleDragStart}
        onStop={this.handleDragEnd}
      >
        <div
          id={node.id}
          style={{
            background: '#fff',
            width: '100px',
            height: '100px',
            border: '1px solid #ccc',
            borderRadius: '5px'
          }}
          className="node"
          onClick={this.props.handleNewRoute}
        >
          <p className='node-name' style={{textAlign: 'center'}}>CLIENT</p>
          <button type='button' className='delete-node' onClick={() => this.props.handleDelete({ id: node.id })}>Delete</button>
        </div>
      </Draggable>
    )
  }
}

export default Client;