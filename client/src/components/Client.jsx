import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import Endpoint from './Endpoint.jsx';

class Client extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x: this.props.x,
      y: this.props.y,
      id: this.props.id,
      routes: this.props.routes,
      isHidden: true,
      text: '',
      routeType: '',
      animate: false,
      showTransition: true,
      routes: this.props.routes,
      currentX: this.props.x,
      currentY: this.props.y
    }
    
    this.setRouteType = this.setRouteType.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.toggleHidden = this.toggleHidden.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.startAnimation = this.startAnimation.bind(this);
    this.toggleTransition = this.toggleTransition.bind(this);
    this.handleRouteUpdateFormat = this.handleRouteUpdateFormat.bind(this);
    this.handleRouteDeleteFormat = this.handleRouteDeleteFormat.bind(this);

  }

  handleMouseDown(e) {
    this.toggleTransition();
    this.coords = {
      x: e.pageX,
      y: e.pageY
    };
    document.addEventListener('mousemove', this.handleMouseMove);
    this.setState({
      dragging: !this.state.dragging,
      currentX: this.state.x,
      currentY: this.state.y
    })
  }

  handleMouseUp() {
    document.removeEventListener('mousemove', this.handleMouseMove);
    this.coords = {};
    const data = {
      id: this.props.id,
      position: {
        x: this.state.x,
        y: this.state.y
      },
      type: 'CLIENT'
    };
    this.props.handleMovement(data, () => {
      this.setState({
        dragging: !this.state.dragging,
        currentX: this.props.x,
        currentY: this.props.y
      })
    });
    this.toggleTransition();
  }

  toggleTransition() {
    this.setState({
      showTransition: !this.state.showTransition
    })
  }

  handleMouseMove(e) {

    const xDiff = this.coords.x - e.pageX;
    const yDiff = this.coords.y - e.pageY;
    
    this.coords.x = e.pageX;
    this.coords.y = e.pageY;

    this.setState({
      x: this.state.x - xDiff,
      y: this.state.y - yDiff,
    }, () => {
      this.setState({
        currentX: this.state.x,
        currentY: this.state.y
      })
    });
  }

  toggleHidden() {
      this.setState({
        isHidden: !this.state.isHidden
      });
  }

  handleText(e) {
    this.setState({
      text: e.target.value
    });
  }

  setRouteType(e) {
    this.setState({
      routeType: e.target.value
    });
  }

  handleRouteDeleteFormat(receivedData) {
    const data = {
      id: this.props.id,
      routeID: receivedData.routeId,
      type: 'CLIENT'
    };
    console.log('route delete format data: ', data)
    this.props.handleRouteDelete(data);
  }

  handleRouteUpdateFormat(receivedData) {
    const data = {
      id: this.props.id,
      routeID: receivedData.routeId,
      url: receivedData.url,
      type: 'CLIENT'
    };
    console.log('route update format data: ', data)
    this.props.handleRouteUpdate(data);
  }

  startAnimation() {
      // Added two nested requestAnimationFrames
      requestAnimationFrame(() => {
        // Firefox will sometimes merge changes that happened here
        requestAnimationFrame(() => {
          this.setState({ animate: !this.state.animate });
        });
      });

    this.toggleHidden();
  }

  render() {

    const showEndpoints = this.props.routes.length ?
      
        this.props.routes.map((endpoint, i) => {
          return <Endpoint
            handleRouteDelete={this.handleRouteDeleteFormat}
            handleRouteUpdate={this.handleRouteUpdateFormat}
            key={i}
            parentId={this.props.id}
            method={endpoint.properties.method}
            url={endpoint.properties.url}
            routeId={endpoint.properties.id} />
        }) : null;
      
    const rectStyle = this.state.showTransition === true ? {
      'transition': 'all 300ms',
    } : null;
    const fadeInStyle = this.state.showTransition === true ? {
      'transition': 'all 200ms 100ms',
      'opacity': this.state.animate ? '1' : '0'
    } : null;

    let x = this.state.currentX;
    let y = this.state.currentY;
    const collapsedDimensions = [100,100];
    const expandedDimensions = [350,250];

    return (
      <g
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}  
      >
        <rect
          x={x}
          y={y}
          rx="10"
          ry="10"
          width={this.state.animate ? expandedDimensions[0] : collapsedDimensions[0]}
          height= {this.state.animate ? expandedDimensions[1] : collapsedDimensions[1]}
          fill="hsla(60, 100%, 71%, 1)"
          stroke="rgba(205, 205, 205, 0.25)"
          strokeWidth="5"
          style={rectStyle}       
        />
        <text x={x + 35} y={y + 20}>Client</text>
        <path
        x={x}
        y={y}
        fill="black"
        onClick={this.startAnimation}
        stroke="rgba(205, 205, 205, 0.25)"
        strokeWidth="5"
        d={
          `M ${x+10} ${y+20}
          a ${collapsedDimensions[0]/100},${collapsedDimensions[0]/100} 0 1,0 ${collapsedDimensions[0]/50},0 
          v ${-collapsedDimensions[0]/20} 
          h ${collapsedDimensions[0]/20} 
          a ${collapsedDimensions[0]/100},${collapsedDimensions[0]/100} 90 1,0 0,${-collapsedDimensions[0]/50} 
          h ${-collapsedDimensions[0]/20} 
          v ${-collapsedDimensions[0]/20} 
          a ${collapsedDimensions[0]/100},${collapsedDimensions[0]/100} 0 1,0 ${-collapsedDimensions[0]/50},0 
          v ${collapsedDimensions[0]/20} 
          h ${-collapsedDimensions[0]/20} 
          a ${collapsedDimensions[0]/100},${collapsedDimensions[0]/100} 45 1,0 0,${collapsedDimensions[0]/50} 
          h ${collapsedDimensions[0]/20} 
          v ${collapsedDimensions[0]/20}`} 
        />
        <foreignObject 
          x={x} 
          y={y+25}
          width={this.state.animate ? expandedDimensions[0] : collapsedDimensions[0]}
          height= {this.state.animate ? expandedDimensions[1]-25 : collapsedDimensions[1]-25}
          style={rectStyle}
        >
          
          {!this.state.isHidden &&
            <div style={fadeInStyle}>  
              <form style={fadeInStyle}>
                <div style={fadeInStyle}>
                <select style={fadeInStyle} value={this.state.routeType} onChange={this.setRouteType}>
                    <option> Select your route</option>
                    <option value="GET">Get</option>
                    <option value="POST"> Post</option>
                    <option value="DELETE">Delete</option>
                    <option value="PUT">Put</option>
                    <option value="OPTIONS">Options</option>
                  </select>
              
                  <input style={fadeInStyle}
                    placeholder='Enter endpoint details'
                    value={this.state.text}
                    onChange={this.handleText.bind(this)}>
                  </input>

                  <button style={fadeInStyle}
                    type="button"
                    onClick={() => this.props.handleNewRoute({ id: this.state.id, method: this.state.routeType, url: this.state.text })}> +
                  </button>
                
                  <div>{showEndpoints}</div> 
              
                <button style={fadeInStyle} type="button" onClick={() => this.props.handleDelete({ id: this.state.id })}>Delete</button>
                </div>
              </form>
              
            </div>
          }
        </foreignObject>
      </g>
    );
  }
}

export default Client;
