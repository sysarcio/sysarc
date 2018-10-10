import React from 'react';

class Endpoint extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      routeId: this.props.endpoint.properties.id,
      method: this.props.endpoint.properties.method,
      url: this.props.endpoint.properties.url
    }

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleMethodChange = this.handleMethodChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  shouldComponentUpdate() {
    const {properties} = this.props.endpoint;
    return this.state.method !== properties.method || 
      this.state.url !== properties.url;
  }

  handleTextChange(e) {
    this.setState({
      url: e.target.value
    });
  }

  handleMethodChange(e) {
    this.setState({
      method: e.target.value
    });
  }

  handleClick() {
    this.props.handleRouteUpdate({
      routeID: this.props.endpoint.properties.id,
      url: this.state.url,
      method: this.state.method
    })
  }

  handleDelete() {
    this.props.handleRouteDelete({
      routeID: this.props.endpoint.properties.id,
      nodeID: this.props.nodeID
    });
  }

  render() {
    const {properties} = this.props.endpoint;
    return (
      <div className="endpoint">
        <select
          defaultValue={properties.method}
          onChange={this.handleMethodChange}
          className="endpoint-method"
        >
          <option value="GET">GET</option>
          <option value="PUT">PUT</option>
          <option value="POST">POST</option>
          <option value="DELETE">DELETE</option>
          <option value="OPTIONS">OPTIONS</option>
        </select>
        <input
          placeholder="Enter your endpoint url"
          type="text"
          value={this.state.url}
          onChange={this.handleTextChange}
          className="endpoint-url"
        />
        <button
          type='button'
          onClick={this.handleClick}
          className="endpoint-save"
        >
          Save
        </button>
        <button
          type='button' 
          onClick={this.handleDelete}
          className="endpoint-delete"
        >
          x
        </button>
      </div>
    )
  }
}


export default Endpoint;