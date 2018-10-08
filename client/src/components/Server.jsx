import React, { Component } from 'react';
import Endpoint from './Endpoint.jsx';
import NewEndpoint from './NewEndpoint.jsx';

class Server extends Component {
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
    const {node} = this.props;

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
            style={{background: '#000', color: '#fff', width: '100%', height: '100%', border: '1px solid #ccc', borderRadius: '5px'}}
            draggable="true"
            className="node"
            onDragStart={this.handleDragStart}
            onDragEnd={this.handleDragEnd}
            onClick={this.toggleSize}
          >
            <p style={{textAlign: 'center'}} onClick={this.toggleSize}>SERVER</p>
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
                <button className="delete-node" type="button" onClick={() => this.props.handleDelete({ id: this.props.get(node, 'id') })}>Delete</button>
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

export default Server;