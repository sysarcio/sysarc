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
                Status Code: {this.props.statusCode}
        </div>
        <div>
                  Description: {this.props.response.description}
        </div>
      </div>
    )
  }
}

export default DocsResponse;