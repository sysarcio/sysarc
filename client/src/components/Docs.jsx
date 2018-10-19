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
      apiTitle: this.props.location.canvasID
    }
    this.getDocsData(this.props.location.canvasID)
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
        paths[Object.keys(connections[e].data)[0]] = connections[e].data
        // console.log(paths);
      })
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
      // console.log('keys of path: ', Object.keys(path));
      return <Endpoint
                key={index}
                basePath = {Object.keys(this.state.paths)[index]}
                path = {path}
                />
    })
    return (
      <div className="docs">
        <div>
          <p>Swagger Version: {this.state.swaggerVersion}</p>
          <p>API Version: {this.state.apiVersion}</p>
          <p>API Title: {this.state.apiTitle}</p>
          <div>{pathCeption}</div>
        </div>
      </div>
    )
  }
}


export default Docs;

