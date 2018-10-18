import React from 'react';

class DocsResponse extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    }

  }

  render() {

    return (
      <div className="docs-response">
        <div>  
          <pre>      Status Code: {this.props.statusCode}</pre>
        </div>
        <div>
          <pre>        Description: {this.props.response.description}</pre>
        </div>
      </div>
    )
  }
}

export default DocsResponse;