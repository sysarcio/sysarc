import React, { Component } from "react";
import axios from "axios";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  async handleLogin(e) {
    e.preventDefault();

    if (!e.target.checkValidity()) {
      return;
    }

    const options = {
      method: "POST",
      url: "/api/login",
      data: this.state
    };

    try {
      const { data } = await axios(options);
      localStorage.userID = data;
      this.props.history.push("/canvases");
    } catch (err) {
      // Actually show user what went wrong
      console.log(err);
    }
  }

  logout() {
    localStorage.removeItem("userID");
    this.props.history.push("/");
  }

  render() {
    return (
      <div className="form-page__wrapper">
        <div className="form-page__form-wrapper">
          <div className="form-page__form-header">
            <h2 className="form-page__form-heading">Login</h2>
          </div>
          <form onSubmit={this.handleLogin}>
            <input
              className="signup-input"
              type="email"
              name="email"
              placeholder="Email"
              required
              title="Must be a valid email address"
              value={this.state.email}
              onChange={this.handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={this.state.password}
              onChange={this.handleChange}
              className="signup-input"
            />
            <div className="submit-form">
              <p onClick={this.props.toggleSignup} className="existing-user">
                Create new account?
              </p>
              <button type="submit" className="signup-btn">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
