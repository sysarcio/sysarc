import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import Canvas from './Canvas.jsx';
import Login from './Login.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    };
  }

  handleInput(e) {
    this.setState({
      text: e.target.value
    });
  }

  goToRoom() {
    this.props.history.push(`/canvas/${this.state.text}`);
  }

  render() {
    return (
      <div>
        <Route
          exact path='/'
          render={() => (
            <div>
              <input type="text" value={this.state.text} onChange={(e) => this.handleInput(e)} placeholder='Room name...' />
              <button onClick={() => this.goToRoom()}>Go To Canvas</button>
            </div>
          )}
        />
        <Route
          path='/login'
          component={Login}
        />
        <Route
          path='/canvas/:name'
          component={Canvas}
        />
      </div>
    );
  }
}

export default withRouter(App);