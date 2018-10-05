import React, { Component } from 'react';
import axios from 'axios';

class Canvases extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canvases: [],
      text: ''
    }

    this.handleChange = this.handleChange.bind(this);
    this.createCanvas = this.createCanvas.bind(this);
  }

  handleChange(e) {
    this.setState({
      text: e.target.value
    });
  }

  async createCanvas() {
    const options = {
      method: 'POST',
      url: '/api/addCanvas',
      data: {
        name: this.state.text
      }
    };

    try {
      const id = await axios(options);
      // this.props.history.push(`/canvas/${id}`);
    } catch(err) {
      // Actually let user know that something went wrong
      console.log(err);
    }
  }

  render() {
    return (
      <div>
        <input
          type="text"
          placeholder="Canvas name..."
          onChange={this.handleChange}
          value={this.state.text}
        />
        <button onClick={this.createCanvas}>Create Canvas</button>
      </div>
    )
  }
}

export default Canvases;