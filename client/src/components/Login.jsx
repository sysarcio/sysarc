import React, { Component } from 'react';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
  }

  handleEmail(e) {
    this.setState({
      email: e.target.value
    });
  }

  handlePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  handleLogin() {
    // actually handle login first
    // if successful login...
    this.props.history.push('/');
  }

  render() {
    return (
      <div className='login'>
        <input type="text" value={this.state.text} onChange={(e) => this.handleEmail(e)} placeholder='Email' />
        <input type="text" value={this.state.text} onChange={(e) => this.handlePassword(e)} placeholder='Password' />
        <button onClick={() => this.handleLogin()}>Login</button>
      </div>
    );
  }
}

export default Login;