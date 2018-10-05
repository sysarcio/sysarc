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

  get(node, prop) {
    let i = node._fieldLookup[prop];
    return node._fields[i];
  }

  handleChange(e) {
    this.setState({
      text: e.target.value
    });
  }

  async componentDidMount() {
    const options = {
      method: 'GET',
      url: '/api/canvases'
    };

    try {
      const {data: canvases} = await axios(options);
      this.setState({
        canvases
      });
    } catch(err) {
      console.log(err);
    }
  }

  async createCanvas() {
    const options = {
      method: 'POST',
      url: '/api/canvas/add',
      data: {
        name: this.state.text
      }
    };

    try {
      const {data: {id, name}} = await axios(options);
      this.props.history.push(`/canvas/${id}`);
    } catch(err) {
      // Actually let user know that something went wrong
      console.log(err);
    }
  }

  goToCanvas(id) {
    this.props.history.push(`/canvas/${id}`);
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
        <div>
          {this.state.canvases.map(c => (
            <div
              style={{
                height: '100px',
                width: '200px',
                border: '1px solid black',
                margin: '20px',
                padding: '20px',
                overflow: 'hidden'
              }}
              onClick={() => this.goToCanvas(this.get(c, 'id'))}
              key={this.get(c, 'id')}
            >
              <p>name: {this.get(c, 'name')}</p>
              <pre>id: {this.get(c, 'id')}</pre>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default Canvases;