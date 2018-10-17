import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import Canvas from './Canvas.jsx';
import Login from './Login.jsx';
import Signup from './Signup.jsx';
import Canvases from './Canvases.jsx';
import Landing from './Landing.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };

    // Refactor to functional component
  }

  render() {
    return (
      <div>
        <Route
          exact path='/'
          component={Landing}
        />
        <Route
          path='/canvases'
          component={Canvases}
        />
        <Route
          path='/login'
          component={Login}
        />
        <Route
          path='/signup'
          component={Signup}
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