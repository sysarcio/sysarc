import React, { Component } from 'react';

class RouteForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currPath: '/users',
      currMethod: '', // which method is the user currently editing?
      data: {
        '/users': {
          'get': {
            description: 'this is a GET description',
            parameters: [{
              name: 'this is a param',
              in: 'query', // query, body, 
              type: 'string', // string, array, integer, boolean, etc...
              required: true,
              items: undefined,
              description: 'this is the param description'
            }],
            responses: {
              '200': {
                description: 'this is the status code description'
              }
            }
          },
          'put': {
            description: 'this is a PUT description',
            parameters: [{
              name: 'this is a PUT param',
              in: 'body', // query, body, 
              type: 'integer', // string, array, integer, boolean, etc...
              required: true,
              items: undefined,
              description: 'this is the param description'
            }],
            responses: {
              '200': {
                description: 'this is the status code description'
              }
            }
          }
        },
      },      
    };

    this.handleSave = this.handleSave.bind(this);
    this.handlePathChange = this.handlePathChange.bind(this);
    this.handleMethodChange = this.handleMethodChange.bind(this);
    this.handleMethodDescriptionChange = this.handleMethodDescriptionChange.bind(this);
  }

  handleSave(e) {
    e.preventDefault();
    const connection = this.props.connection;
    connection.data = this.state.data;
    this.props.emitUpdateConnectionData(connection);
    // this.props.toggleOpenConnection();
  }

  handlePathChange(e) {
    const data = JSON.parse(JSON.stringify(this.state.data));
    data[e.target.value] = undefined

    this.setState({
      currPath: e.target.value,
      data
    });
  }

  handleMethodChange(e) {
    this.setState({
      currMethod: e.target.value
    });
  }

  handleMethodDescriptionChange(e) {
    this.setState({
      methodDescription: e.target.value
    })
  }

  render() {
    const formContainer = {
      position: 'absolute',
      top: Math.max((this.props.connection.handleY * this.props.canvasHeight) - 200, 0),
      left: (this.props.connection.handleX * this.props.canvasWidth) + 3.5 - 100,
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
            value={this.state.currPath}
            onChange={this.handlePathChange}
            style={{width: "100%"}}
          />

          {Object.keys(this.state.data[this.state.currPath]).map((m, i) => {
            const method = this.state.data[this.state.currPath][m];

            return (
              <div key={i}>
                <div>{m.toUpperCase()}</div>
                <div>{method.description}</div>
                {method.parameters.map((p, i) => {
                  return (
                    <div key={i}>
                      <div>{p.description}</div>
                      <div>{p.name}</div>
                      <div>{p.in}</div>
                      <div>{p.type}</div>
                      <div>{p.required}</div>
                    </div>
                  )
                })}
                {Object.keys(method.responses).map((r, i) => {
                  return (
                    <div key={i}>
                      <div>STATUS CODE: {r}</div>
                      <div>{method.responses[r].description}</div>
                    </div>
                  )
                })}
              </div>
            )
          })}

          {/* {this.state.path ? 
            <div
              style={{display: 'flex', flexWrap: 'wrap'}}
            >
              <select
                value={this.state.method}
                onChange={this.handleMethodChange}
                style={{width: "30%"}}
              >
                <option value="GET">GET</option>
                <option value="PUT">PUT</option>
                <option value="POST">POST</option>
                <option value="DELETE">DELETE</option>
              </select>
              <input
                type="text"
                value={this.state.methodDescription}
                onChange={this.handleMethodDescriptionChange}
                placeholder="Enter request description..."
                style={{width: "70%"}}
              />
              <button>+ Param</button>
            </div>
          :
            null
          } */}
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