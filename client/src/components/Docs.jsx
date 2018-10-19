import React from 'react';
import axios from 'axios';
<<<<<<< HEAD
import Endpoint from './DocsEndpoint.jsx';
=======
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Endpoint from './DocsEndpoint.jsx';
import bootstrap from 'react-bootstrap';
>>>>>>> styling for docs

class Docs extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      swaggerVersion: '2.0',
      paths: {},
      apiVersion: 1,
<<<<<<< HEAD
      apiTitle: this.props.location.canvasID
    }
    this.getDocsData(this.props.location.canvasID);
    this.goToCanvas = this.goToCanvas.bind(this);
  }

  goToCanvas() {
    this.props.history.push(`/canvas/${this.props.location.canvasID}`);
  }


=======
      apiTitle: window.location.pathname.split('/')[2]
    }
    this.getDocsData(window.location.pathname.split('/')[2])
    console.log(window.location.pathname.split('/')[2]);
  }

>>>>>>> styling for docs
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
<<<<<<< HEAD
        paths[Object.keys(connections[e].data)[0]] = connections[e].data
        // console.log(paths);
      })
=======
        if(Object.keys(connections[e].data)[0]!=="") {
          paths[Object.keys(connections[e].data)[0]] = connections[e].data
          // console.log(paths);
        }
      })
      console.log(paths);
>>>>>>> styling for docs
      this.setState({
        paths
      });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
<<<<<<< HEAD
=======
    
>>>>>>> styling for docs
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
<<<<<<< HEAD
    return <div className="docs">
        <div>
          <p>Swagger Version: {this.state.swaggerVersion}</p>
          <p>API Version: {this.state.apiVersion}</p>
          <p>API Title: {this.state.apiTitle}</p>

          <div>{pathCeption}</div>
        </div>
      <button className="return-button" onClick={this.goToCanvas}>
        Return to Canvas
          </button>
      </div>;
=======
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
>>>>>>> styling for docs
  }
}


export default Docs;

