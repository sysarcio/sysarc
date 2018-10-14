import React, { Component } from 'react';
import axios from 'axios';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };

    this.handlePassword = this.handlePassword.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleEmail(e) {
    e.preventDefault();
    this.setState({
      email: e.target.value
    });
  }

  handlePassword(e) {
    e.preventDefault();
    this.setState({
      password: e.target.value
    });
  }

  async handleLogin(e) {
    const isValid = document.getElementById("login-form").checkValidity();
    
    if (isValid) {
      e.preventDefault();
      const options = {
        method: 'POST',
        url: '/api/login',
        data: {
          email: this.state.email,
          password: this.state.password
        }
      };

      try {
        const {data} = await axios(options);
        localStorage.userID = data;
        this.props.history.push('/');
      } catch(err) {
        // Actually show user what went wrong
        console.log(err);
      }
    }
  }

  render() {
    return (
      <div className='login'>
        <form id="login-form">
          <input 
            type="email"
            placeholder='Email'
            required
            title="Must be a valid email address"
            value={this.state.email}
            onChange={this.handleEmail}
          />
          <input
            type="password"
            placeholder='Password'
            required
            value={this.state.password}
            onChange={this.handlePassword}
          />
          <input
            type="submit"
            onClick={this.handleLogin}
            value="Login"
          />
        </form>
      </div>
    );
  }
}

export default Login;