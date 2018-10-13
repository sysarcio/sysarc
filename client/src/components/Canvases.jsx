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
    this.get = this.get.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.createCanvas = this.createCanvas.bind(this);
    this.goToCanvas = this.goToCanvas.bind(this);
    this.toggleShowForm = this.toggleShowForm.bind(this);
    this.deleteCanvas = this.deleteCanvas.bind(this);

  }

  async componentDidMount() {
    const options = {
      method: 'GET',
      url: '/api/canvases'
    };

    try {
      const {data: canvases} = await axios(options);
      console.log('canvases from axios', canvases);
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

  async createCanvas(e) {
    e.preventDefault();
    const options = {
      method: 'POST',
      url: '/api/canvas/add',
      data: {
        name: this.state.text
      }
     
    };

    try {
      const {data: {id, name}} = await axios(options);
      console.log('id-->', id)
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

deleteCanvas(id) {
  axios.delete(`/api/canvas/${id}`)
    .then(response => {

      const canvasesCopy = this.state.canvases.slice();
     
      const canvasesAfterDelete = canvasesCopy.filter(canvas => {
        return this.get(canvas, 'id');
      })

      this.setState({
        canvases: canvasesAfterDelete 
      });
    })
    .catch(err => {
      console.log('unable to delete canvas ', err);
    })
  }

  render() {

    const showForm = this.state.showForm ? 
      <div >
      <form className='canvases-form' >
        <input
          type="text"
          placeholder="Canvas name..."
          onChange={this.handleChange}
          value={this.state.text}
          className='form-input'
        />
          <button className='form-button' onClick={this.createCanvas}>+</button>
        </form> 
    </div> : 
      
      <div  className='canvases-plus'>
        <button className='canvas-button' onClick={this.toggleShowForm} >
          <strong>+</strong>
        </button>
      </div>

    return (
      <div className='canvases '>
        <div className="canvases">
       
          {showForm}

          {this.state.canvases.map(c => {
            if (this.get(c, 'id')) {
              return (
                <CanvasThumbnail
                  deleteCanvas={this.deleteCanvas}
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