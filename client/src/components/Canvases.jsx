import React, { Component } from 'react';
import CanvasThumbnail from './CanvasThumbnail.jsx';
import axios from 'axios';

class Canvases extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canvases: [],
      text: '',
      showForm: false
    }

    this.handleChange = this.handleChange.bind(this);
    this.createCanvas = this.createCanvas.bind(this);
    this.goToCanvas = this.goToCanvas.bind(this);
    this.toggleShowForm = this.toggleShowForm.bind(this);

  }

  async componentDidMount() {
    const options = {
      method: 'GET',
      url: '/api/canvases'
    };

    try {
      const {data: canvases} = await axios(options);
      console.log(canvases);
      this.setState({
        canvases
      });
    } catch(err) {
      console.log(err);
      // tell user they must be logged in
      // this.props.history.push('/login');
    }
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

    this.toggleShowForm();
  }

  goToCanvas(id) {
    this.props.history.push(`/canvas/${id}`);
  }

  toggleShowForm() {
    this.setState({ showForm: !this.state.showForm})
  }

  render() {

    const showForm = this.state.showForm ? 
    
    <form className='canvases-form'>
      <input
        type="text"
        placeholder="Canvas name..."
        onChange={this.handleChange}
        value={this.state.text}
      />
      <button onClick={this.createCanvas}>Create Canvas</button>
      </form> : <div className='canvases-form'><p className='canvas-p' onClick={this.toggleShowForm} >+</p></div>

    return (
      <div className='canvases '>
        <div className="canvases">
       
          {showForm}

          {this.state.canvases.map((c, i) => {
            if (this.get(c, 'id')) {
              return (
                <CanvasThumbnail
                  index={i}
                  get={this.get}
                  canvas={c}
                  goToCanvas={this.goToCanvas}
                  key={this.get(c, 'id')}
                />
              )
            }
          })}
        </div>
      </div>
    )
  }
}

export default Canvases;