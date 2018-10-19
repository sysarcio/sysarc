import React from 'react';
import axios from 'axios';
import Endpoint from './DocsEndpoint.jsx';

class Docs extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      swaggerVersion: '2.0',
      paths: {},
      apiVersion: 1,
      apiTitle: window.location.pathname.split('/')[2]
    }
    this.getDocsData(window.location.pathname.split('/')[2])
    console.log(window.location.pathname.split('/')[2]);
  }
  goToCanvas() {
    this.props.history.push(`/canvas/${this.props.location.canvasID}`);
  }

  async getDocsData(id) {
    const options = {
      url: `/api/Docs/${id}`,
      method: 'GET'
    };

    try {
      const { data } = await axios(options);
      // console.log(`made it back to client with data: \n`);
      // console.log(data);
      const { connections } = data;
      let paths = {};
      Object.keys(connections).map((e, i)=> {
        if(Object.keys(connections[e].data)[0]!=="") {
          paths[Object.keys(connections[e].data)[0]] = connections[e].data
          // console.log(paths);
        }
      })
      console.log(paths);
      this.setState({
        paths
      });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    // console.log(this.props.location.canvasID)
    // console.log('paths on entrance into render: ', this.state.paths)
    const pathCeption = Object.values(this.state.paths).map((path, index) => {
      // console.log('path/endpoint: ',Object.keys(this.state.paths)[index], ' ', path);
      console.log(Object.keys(this.state.paths)[index]);
      if (Object.keys(this.state.paths)[index] !== '' && Object.keys(this.state.paths)[index] !== "") { // console.log('keys of path: ', Object.keys(path));
      return (
        <Endpoint
          key={index}
          basePath = {Object.keys(this.state.paths)[index]}
          path = {path}
        />
      )}
    })
    return (
      <div className="docs">
        <div>
          <h1 className="card-title">API Title: {this.state.apiTitle}</h1>
          <h2 className="text-muted">Swagger Version: {this.state.swaggerVersion}</h2>
          <h2 className="text-muted">API Version: {this.state.apiVersion}</h2>
          
          <div>{pathCeption}</div>
        </div>
      </div>
    )
  }
}


export default Docs;

