import React, { Component } from 'react';
import axios from 'axios';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };

    this.handlePassword = this.handlePassword.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
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

  handleSignup(e) {
    const isValid = document.getElementById("signup-form").checkValidity();
    
    if (isValid) {
      e.preventDefault();
      const options = {
        method: 'POST',
        url: '/api/signup',
        data: {
          email: this.state.email,
          password: this.state.password
        }
      };

      axios(options)
        .then(data => {
          console.log(data);
          this.props.history.push('/');
        })
        .catch(err => {
          // Actually show user what went wrong
          console.log(err);
        });
    }
  }

  render() {
    return (
      <div className='signup'>
        <form id="signup-form">
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
            onClick={this.handleSignup}
            value="Signup"
          />
        </form>
      </div>
    );
  }
}

export default Signup;