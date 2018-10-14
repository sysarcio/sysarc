import React, { Component } from 'react';

class RouteForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      path: this.props.connection.data.path || '',
      method: this.props.connection.data.method || ''
    };

    this.handleSave = this.handleSave.bind(this);
    this.handlePathChange = this.handlePathChange.bind(this);
  }

  handleSave(e) {
    e.preventDefault();
    const connection = this.props.connection;
    connection.data = {
      path: this.state.path,
      method: this.state.method
    }
    this.props.emitUpdateConnectionData(connection);
    // this.props.toggleOpenConnection();
  }

  handlePathChange(e) {
    this.setState({
      path: e.target.value
    });
  }

  render() {
    const formContainer = {
      position: 'absolute',
      top: this.props.connection.handleY - 200 - 20,
      left: this.props.connection.handleX + 3.5 - 100,
      background: 'rgba(255,255,255,0.8)',
      height: '200px',
      width: '200px',
      borderRadius: '5px',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      padding: '20px',
      overflowX: 'scroll'
    }

    const formStyle = {
      display: 'flex',
      flexDirection: 'column'
    }

    const saveStyle = {
      marginTop: 'auto'
    }

    return (
      <div style={formContainer}>
        <form style={formStyle}>
          <input
            type="text"
            placeholder="Enter path..."
            value={this.state.path}
            onChange={this.handlePathChange}
            style={{width: "100%"}}
          />
          <input
            type="submit"
            value="SAVE"
            onClick={this.handleSave}
            style={saveStyle}
          />
        </form>
      </div>
    );
  }
}

export default RouteForm;