import React from 'react';

class Endpoint extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      text: '',
      method: this.props.method,
      showInputBox: false,
      routeId: this.props.routeId
    }
  }

  componentDidMount() {
    this.setState({
      routeId: this.props.routeId
    });
  }

  handleTextChange(e) {
    this.setState({
      text: e.target.value
    })
  }

  toggleInputBox(e) {
    e.preventDefault()
    this.setState({
      showInputBox: !this.state.showInputBox
    })
  }

  handleSubmitEdit(callback, callbackArgument) {
    this.setState({
      showInputBox: !this.state.showInputBox
    })
    callback(callbackArgument);
  }

  render() {
    const updateDisplay = !this.state.showInputBox 
      ?
      <div> {this.props.method}: / {this.props.url}
        <button type='button' onClick={this.toggleInputBox.bind(this)}>
          Update
        </button>
      </div> 
      :
      <div>
        {this.props.method}: / <input placeholder={this.props.url} type="text" value={this.state.text} onChange={this.handleTextChange.bind(this)} />
        <button type='button' onClick={() => this.handleSubmitEdit(this.props.handleRouteUpdate, { routeId: this.props.routeId, url: this.state.text })}>
          Save Route
        </button>
        <button  type='button' onClick={() => this.handleSubmitEdit(this.props.handleRouteDelete, { routeId: this.props.routeId})}>
          Delete Route
        </button>
      </div>
      ;
  
    return (
      <div>{updateDisplay}</div>
    )
  }
}


export default Endpoint;