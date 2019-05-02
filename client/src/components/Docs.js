import React from "react";
import axios from "axios";
import Endpoint from "./DocsEndpoint";

class Docs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      swaggerVersion: "2.0",
      paths: {},
      apiVersion: 1,
      apiTitle: "Your Canvas"
    };
    this.getDocsData(window.location.pathname.split("/")[2]);
    this.goToCanvas = this.goToCanvas.bind(this);
  }
  goToCanvas() {
    this.props.history.push(
      `/canvas/${window.location.pathname.split("/")[2]}`
    );
  }

  async getDocsData(id) {
    const options = {
      url: `/api/Docs/${id}`,
      method: "GET"
    };

    try {
      const { data } = await axios(options);

      const { connections } = data;
      let paths = {};
      Object.keys(connections).map((e, i) => {
        if (Object.keys(connections[e].data)[0] !== "") {
          paths[Object.keys(connections[e].data)[0]] = connections[e].data;
        }
      });

      this.setState({
        paths
      });
    } catch (err) {}
  }

  render() {
    const pathCeption = Object.values(this.state.paths).map((path, index) => {
      if (
        Object.keys(this.state.paths)[index] !== "" &&
        Object.keys(this.state.paths)[index] !== ""
      ) {
        return (
          <Endpoint
            key={index}
            basePath={Object.keys(this.state.paths)[index]}
            path={path}
          />
        );
      }
    });
    return (
      <div className="docs">
        <div>
          <h1 className="card-title">API Title: {this.state.apiTitle}</h1>
          <h2 className="text-muted">
            Swagger Version: {this.state.swaggerVersion}
          </h2>
          <h2 className="text-muted">API Version: {this.state.apiVersion}</h2>
          <div>{pathCeption}</div>
        </div>
        <button className="return-button" onClick={this.goToCanvas}>
          Return to Canvas
        </button>
      </div>
    );
  }
}

export default Docs;
