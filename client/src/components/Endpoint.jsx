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
    })
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
 render() {
   
   const updateDisplay = !this.state.showInputBox ?
     <div> {this.props.method}: / {this.props.url}
       <button type='button' onClick={this.toggleInputBox.bind(this)}>Update</button>
     </div> :
     
     <div>
       {this.props.method}: / <input placeholder={this.props.url} type="text" value={this.state.text} onChange={this.handleTextChange.bind(this)} />
       
       <button type='button' onClick={() => this.props.handleRouteUpdate({ routeId: this.props.routeId, text: this.state.text })}>
         Save Route
        </button><button onClick={() => { this.props.handleRouteDelete({ routeId: this.props.routeId})}} type='button'> Delete Route</button>
     </div>;

   return (
     <div>{updateDisplay}</div>
   )
  }
}


export default Endpoint;