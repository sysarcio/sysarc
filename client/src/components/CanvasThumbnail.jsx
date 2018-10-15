import React, { Component } from 'react';
import DeletePop from './DeletePop.jsx';

  
// const CanvasThumbnail = ({ canvas, get, goToCanvas, deleteCanvas}) => {

class CanvasThumbnail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    }

    this.handleModalShowClick = this.handleModalShowClick.bind(this);
    this.handleModalCloseClick = this.handleModalCloseClick.bind(this);
  }

  handleModalShowClick(e) {
    e.preventDefault();
    this.setState({
      showModal: true
    })
  }

  handleModalCloseClick() {
    this.setState({
      showModal: false
    })
  }

  render() {

    const showModal = this.state.showModal;
    const showDeleteOption = <button className='canvas-delete-btn' onClick={this.handleModalShowClick}>X</button>
    const showConfirmation = <div> Delete Canvas? <button onClick={() => this.props.deleteCanvas(this.props.get(this.props.canvas, 'id'))}> Delete </button> <button onClick={this.handleModalCloseClick}> Cancel </button></div>

    return (
      <div
        className="canvas-thumbnail"
        id={this.props.get(this.props.canvas, 'id')}>
        
        {showModal ? showConfirmation : showDeleteOption }
        <div>
          <h3 onClick={() => this.props.goToCanvas(this.props.get(this.props.canvas, 'id'))}>{this.props.get(this.props.canvas, 'name')}</h3>

          <img
            onClick={() => this.props.goToCanvas(this.props.get(this.props.canvas,  'id'))}
            src={this.props.get(this.props.canvas, 'image')}
            height="40"
            width="160"
            alt={this.props.get(this.props.canvas, 'name')}
          />
          <pre>{this.props.get(this.props.canvas, 'id')}</pre>
        </div>;
      </div>


    );
  }
}
  
  

export default CanvasThumbnail;

// onClick = {() => deleteCanvas(get(canvas, 'id'))}
//onClick={(e) => { if (window.confirm('Are you sure you wish to delete this item?')) deleteCanvas(get(canvas, 'id')) }}
