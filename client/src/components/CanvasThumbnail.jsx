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
    const showDeleteOption = <p className='canvas-delete-btn' onClick={this.handleModalShowClick}>X</p>
    const showConfirmation = <div className='canvas-delete-confirm'> Delete Canvas? 
      <div>
        <p 
          className='final-delete' 
          onClick={() => this.props.deleteCanvas(this.props.get(this.props.canvas, 'id'))}> 
            Yes 
        </p > 
        
        <p 
          className='final-delete' 
          onClick={this.handleModalCloseClick}> 
            No 
        </p >
      </div>
    </div>
    const divStyle = {
      'height':"70px", 
      'width':"70px"
    }
    return <div className="canvas-thumbnail" id={this.props.get(this.props.canvas, 'id')}>
    <div className = 'centered-div'>
        {showModal ? showConfirmation : showDeleteOption}
        <div className="canvas-thumbnail-goto" onClick={() => this.props.goToCanvas(this.props.get(this.props.canvas, 'id'))}>
          <h3>{this.props.get(this.props.canvas, 'name')}</h3>
        <div style={divStyle}>
            <img src={this.props.get(this.props.canvas, 'image')} width="100%" alt={this.props.get(this.props.canvas, 'name')} />
          </div>
        </div>
      </div>
      </div>;
  }
}
  
  

export default CanvasThumbnail;
