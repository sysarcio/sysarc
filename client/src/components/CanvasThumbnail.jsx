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
    const showConfirmation = <div className='canvas-delete-confirm'> Delete Canvas? <button onClick={() => this.props.deleteCanvas(this.props.get(this.props.canvas, 'id'))}> Y </button> <button onClick={this.handleModalCloseClick}> N </button></div>
    const divStyle = {
      'object-fit': 'cover',
      'height':"70px", 
      'width':"70px"
    }
    return <div className="canvas-thumbnail" id={this.props.get(this.props.canvas, 'id')}>
    <div className = 'centered-div'>
        {showModal ? showConfirmation : showDeleteOption}
        <div onClick={() => this.props.goToCanvas(this.props.get(this.props.canvas, 'id'))}>
          <h3>{this.props.get(this.props.canvas, 'name')}</h3>
        <div style={divStyle}>
            <img src={this.props.get(this.props.canvas, 'image')} object-fit='cover' width="100%" alt={this.props.get(this.props.canvas, 'name')} />
          </div>
        </div>
      </div>
      </div>;
  }
}
  
  

export default CanvasThumbnail;