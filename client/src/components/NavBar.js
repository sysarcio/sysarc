import React, { Component } from 'react';

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    const navStyle = {
      width: '100%',
      height: '50px',
      background: 'linear-gradient(rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))',
      display: 'flex',
      alignItems: 'center'
    };

    return (
      <nav style={navStyle}>
        <a href="#">Canvases</a>
        <a href="#">Login</a>
      </nav>
    )
  }
}

export default NavBar;