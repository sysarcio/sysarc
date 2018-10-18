import React from 'react';
import Endpoint from './DocsEndpoint.jsx';

class Docs extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    }

  }

  render() {
    
    const pathCeption = Object.values(this.props.json.paths).map((path, index) => {
      console.log('path/endpoint: ',Object.keys(this.props.json.paths)[index], ' ', path);
      console.log('keys of path: ', Object.keys(path));
      return <Endpoint
                key={index}
                basePath = {Object.keys(this.props.json.paths)[index]}
                path = {path}
                />
    })
    return (
      <div className="docs">
        <div>
          <p>Swagger Version: {this.props.json.swagger}</p>
          <p>API Version: {this.props.json.info.version}</p>
          <p>API Title: {this.props.json.info.title}</p>
          <div>{pathCeption}</div>
        </div>
      </div>
    )
  }
}


export default Docs;

