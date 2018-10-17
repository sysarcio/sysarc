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

  async handleSignup(e) {
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

      try {
        const data = await axios(options);
        console.log(data);
        this.props.history.push('/canvases');
      } catch(err) {
        console.log(err);
      }
    }
  }

  render() {
    return (


      <div className='form-page__wrapper'>
        <div className='form-page__form-wrapper'>
          <div className='form-page__form-header'>
            <h2 className='form-page__form-heading'>Login</h2>
          </div>
          <form id="signup-form">
            <input
              type="email"
              placeholder='Email'
              required
              title="Must be a valid email address"
              value={this.state.email}
              onChange={this.handleEmail}
              className='signin-input'
            />
            <input
              type="password"
              placeholder='Password'
              required
              value={this.state.password}
              onChange={this.handlePassword}
              className='signin-input'
            />
            <input
              type="submit"
              onClick={this.handleSignup}
              value="Signup"
              className='signin-input'
            />
          </form>
        </div>
       
      </div>






      // <div className='signup'>
      //   <form id="signup-form">
      //     <input 
      //       type="email"
      //       placeholder='Email'
      //       required
      //       title="Must be a valid email address"
      //       value={this.state.email}
      //       onChange={this.handleEmail}
      //     />
      //     <input
      //       type="password"
      //       placeholder='Password'
      //       required
      //       value={this.state.password}
      //       onChange={this.handlePassword}
      //     />
      //     <input
      //       type="submit"
      //       onClick={this.handleSignup}
      //       value="Signup"
      //     />
      //   </form>
      // </div>
    );
  }
}

export default Signup;