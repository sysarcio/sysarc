import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import Endpoint from './Endpoint.jsx';

class Database extends React.Component {
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
      type: 'DATABASE'
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
          handleRouteDelete={this.props.handleRouteDelete}
          handleRouteUpdate={this.props.handleRouteUpdate}
          key={i}
          method={this.props.get(endpoint, 'method')}
          url={this.props.get(endpoint, 'url')}
          routeId={this.props.get(endpoint, 'id')} />
      }) : null;

    const rectStyle = this.state.showTransition === true ? {
      'transition': 'all 300ms',
      'border': '1px solid #ddd',
    } : null;

    const fadeInStyle = this.state.showTransition === true ? {
      'transition': 'all 200ms 100ms',
      'opacity': this.state.animate ? '1' : '0'
    } : null;
    
    let x = this.state.currentX;
    let y = this.state.currentY;

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={this.state.animate ? 350 : 100}
          height={this.state.animate ? 250 : 50}
          fill="yellow"
          style={rectStyle}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
        />
        <text x={x + 35} y={y + 20}>Database</text>

        <foreignObject x={x + 5} y={y + 70} width="375" height="250">

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
        <foreignObject x={x + 80} y={y - 10} width="15" height="15">
          <p onClick={this.startAnimation}>+</p>
        </foreignObject>
      </g>
    );
  }
}

export default Database;
