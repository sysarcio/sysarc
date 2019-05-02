import React from "react";
import { Route, withRouter } from "react-router-dom";
import Canvas from "./Canvas";
import Login from "./Login";
import Signup from "./Signup";
import Canvases from "./Canvases";
import Landing from "./Landing";
import Docs from "./Docs";

const App = () => (
  <div>
    <Route exact path="/" component={Landing} />
    <Route path="/canvases" component={Canvases} />
    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup} />
    <Route path="/canvas/:name" component={Canvas} />
    <Route path="/docs" component={Docs} />
  </div>
);

export default withRouter(App);
