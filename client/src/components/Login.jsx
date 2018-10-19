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
    console.log('login called')
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
        console.log('login was successful')
        const {data} = await axios(options);
        localStorage.userID = data;
        this.props.history.push('/canvases');
      } catch(err) {
        // Actually show user what went wrong
        console.log(err);
      }
    }
  }

  logout(){
    localStorage.removeItem('userID')
    this.props.history.push('/');
  }

  render() {
    return (
      <div className='form-page__wrapper'>
        <div className='form-page__form-wrapper'>
          <div className='form-page__form-header'>
            <h2 className='form-page__form-heading'>Login</h2>
          </div>
        <form id="login-form">
          <input 
            className='signup-input'
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
            className='signup-input'
          />
          </form>
          <div className='submit-form'>
            <p onClick={this.props.toggleSignup} className='existing-user'>Create new account?</p>
            <button
              type="submit"
              onClick={this.handleLogin}
              className='signup-btn'>
              Login
              </button>
          </div>
        </div>

      </div>
    );
  }
}

export default Login;
