import React, { Component } from 'react';
import $ from 'jquery';
import Draggable from 'react-draggable';
import Endpoint from './Endpoint.jsx';
import NewEndpoint from './NewEndpoint.jsx';

class Database extends Component {
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
      id: this.props.get(this.props.node, 'id')
    };

    this.props.handleMovement(data);
  }

  render() {
    const {node} = this.props;
    $(`#${node.id}`).show();
    console.log(`rendering db ${node.id}`);

    return (
      <g>
        <foreignObject
          x={this.props.get(node, 'x')}
          y={this.props.get(node, 'y')}
          width={this.state.isOpen ? "350px" : "100px"}
          height={this.state.isOpen ? "250px" : "100px"}
          className="node-container"
        >
          <div
            id={this.props.get(node, 'id')}
            style={{background: 'gray', width: '100%', height: '100%', border: '1px solid #ccc', borderRadius: '5px'}}
            draggable="true"
            className="node"
            onDragStart={this.handleDragStart}
            onDragEnd={this.handleDragEnd}
            onClick={this.toggleSize}
          >
            <p style={{textAlign: 'center'}} onClick={this.toggleSize}>DATABASE</p>
            {this.state.isOpen ? 
              <button onClick={this.toggleAddRoute} className="add-route">+</button>
            :
              null
            }
            {this.state.isOpen ? 
              <div>
                <div className="endpoints">
                  {this.state.isAddingRoute && this.state.isOpen ? 
                    <NewEndpoint
                      nodeID={this.props.get(node, 'id')}
                      handleNewRoute={this.props.handleNewRoute}
                      toggleAddRoute={this.toggleAddRoute}
                    />
                  :
                    null
                  }
                  {this.props.get(node, 'routes').map(endpoint => (
                    <Endpoint
                      key={endpoint.properties.id}
                      nodeID={this.props.get(node, 'id')}
                      endpoint={endpoint}
                      handleRouteDelete={this.props.handleRouteDelete}
                      handleRouteUpdate={this.props.handleRouteUpdate}
                    />
                  ))}
                </div>
                <button type="button" className="delete-node" onClick={() => this.props.handleDelete({ id: this.props.get(node, 'id') })}>Delete</button>
              </div>
            :
              null
            }
          </div>
        </foreignObject>
      </g>
    )
  }
}

export default Database;