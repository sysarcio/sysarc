import React from 'react';
class DocsParameter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    }

  }

  render() {
    return (
      <div className="docs-parameter">
        <div className="parameter-name">{this.props.param.name.toUpperCase()}</div>
        <div className="parameter-description">Description: {this.props.param.description} {this.props.param.required && (' IS REQUIRED')}</div>
        <div className="parameter-type">Format: {this.props.param.type.toUpperCase()} {this.props.param.type === 'array' ? `[${this.props.param.items.type}]` : null}</div>
        <div className="parameter-in">Sent In: {this.props.param.in.toUpperCase()}</div> 
      </div>
    )
  }
}




export default DocsParameter;