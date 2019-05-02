import React from "react";
import Operation from "./DocsOperation";

class DocsEndpoint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true
    };

    this.expand = this.expand.bind(this);
  }

  expand(e) {
    this.setState({
      show: !this.state.show
    });
  }

  render() {
    const pathCeptionThePathening = path => {
      return Object.values(path).map((operation, index) => {
        if (
          operation.description !== "" ||
          operation.parameters.length !== 0 ||
          Object.keys(operation.responses)[0] !== ""
        ) {
          return (
            <Operation
              expand={this.expand}
              key={index}
              method={Object.keys(path)[index]}
              operation={operation}
              pathName={this.props.basePath}
              className={`docs-method-${Object.keys(path)[index]}`}
            />
          );
        }
      });
    };

    return (
      <div className="docs-endpoint">
        <div onClick={this.expand}>
          <h3 className="docs-endpoint-heading">
            {this.props.basePath.toUpperCase()}
          </h3>
        </div>
        {this.state.show && (
          <div className="docs-details-container">
            {pathCeptionThePathening(this.props.path[this.props.basePath])}
          </div>
        )}
      </div>
    );
  }
}

export default DocsEndpoint;
