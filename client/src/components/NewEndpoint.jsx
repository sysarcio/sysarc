import React from 'react';

class NewEndpoint extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      method: 'GET',
      url: '',
    }

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleMethodChange = this.handleMethodChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
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
    this.props.toggleAddRoute();

    this.props.handleNewRoute({
      url: this.state.url,
      method: this.state.method,
      id: this.props.nodeID
    });

    // this.setState({
    //   method: '',
    //   url: ''
    // })
  }

  render() {
    return (
      <div className="endpoint">
        <select
          name=""
          defaultValue={this.state.tempMethod}
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
          onClick={this.props.toggleAddRoute}
          className="endpoint-delete"
        >
          x
        </button>
      </div>
    )
  }
}


export default NewEndpoint;