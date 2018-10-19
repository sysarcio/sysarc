import React from 'react';

class DocsParameter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    }

  }

  render() {
    return (
      <div>
        <em>{this.props.param.name}</em> 
        Description:{this.props.param.description} {this.props.param.required && (' IS REQUIRED')} 
        Format:{this.props.param.type} {this.props.param.type === 'array' ? `[${this.props.param.items.type}]` : null} 
        Sent In:{this.props.param.in} 
      </div>
    )
  }
}




export default DocsParameter;