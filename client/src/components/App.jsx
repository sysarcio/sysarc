import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import Canvas from './Canvas.jsx';
import Login from './Login.jsx';
import Signup from './Signup.jsx';
import Canvases from './Canvases.jsx';
import Landing from './Landing.jsx';
import NavBar from './NavBar.jsx'
import Docs from './Docs.jsx';

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
        {/* <NavBar /> */}
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
        <Route
          path='/docs'
          component={Docs}
        />
      </div>
    );
  }
}

export default withRouter(App);