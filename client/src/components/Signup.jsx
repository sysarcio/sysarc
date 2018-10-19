import React, { Component } from 'react';
import axios from 'axios';



class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };

    console.log(this.props.history);

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
        const {data} = await axios(options);
        localStorage.userID = data;
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
            <h2 className='form-page__form-heading'>Sign Up</h2>
          </div>
          <form id="signup-form">
            <input
              type="email"
              placeholder='Email'
              required
              title="Must be a valid email address"
              value={this.state.email}
              onChange={this.handleEmail}
              className='signup-input'
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
            <p onClick={this.props.toggleLogin} className='existing-user'>Already have an account?</p>
            <button
              type="submit"
              onClick={this.handleSignup}
              className='signup-btn'>
              Signup
              </button>
          </div>
        </div>
       
      </div>


    );
  }
}

export default Signup;