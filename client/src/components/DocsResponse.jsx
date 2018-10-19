import React from 'react';
<<<<<<< HEAD
=======
import bootstrap from 'react-bootstrap'
>>>>>>> styling for docs

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
<<<<<<< HEAD
          <pre>      Status Code: {this.props.statusCode}</pre>
        </div>
        <div>
          <pre>        Description: {this.props.response.description}</pre>
=======
                Status Code: {this.props.statusCode}
        </div>
        <div>
                  Description: {this.props.response.description}
>>>>>>> styling for docs
        </div>
      </div>
    )
  }
}

export default DocsResponse;