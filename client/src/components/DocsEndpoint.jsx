import React from 'react';
import Operation from './DocsOperation.jsx';
<<<<<<< HEAD
=======
import bootstrap from 'react-bootstrap'
>>>>>>> styling for docs

class DocsEndpoint extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      show: true
    }

    this.expand = this.expand.bind(this);
  }

  expand(e) {
    this.setState({
      show: !this.state.show
    })
    // console.log(this.state.show);
  }
  render() {
    // console.log(this.props.path)
    const pathCeptionThePathening = (path) => {
      // console.log(`input passed from DocsEndpoint to DocsOperation: `);
      // console.log(path);
      return Object.values(path).map((operation, index) => {
        return <Operation
                expand={this.expand}
                key={index}
                method = {Object.keys(path)[index]}
                operation = {operation}
                pathName = {this.props.basePath}
<<<<<<< HEAD
=======
                className = {`docs-method-${Object.keys(path)[index]}`}
>>>>>>> styling for docs
              />
      })
    }

    return (
      <div className="docs-endpoint">
        <div onClick={this.expand}>
<<<<<<< HEAD
          Endpoint: {this.props.basePath}
        </div>
        {this.state.show && (
          <div>
=======
          <h3 className="docs-endpoint-heading">{this.props.basePath.toUpperCase()}</h3>
        </div>
        {this.state.show && (
          <div className="docs-details-container">
>>>>>>> styling for docs
            {pathCeptionThePathening(this.props.path[this.props.basePath])}
          </div>)
        }
      </div>
    )
  }
}

export default DocsEndpoint;
