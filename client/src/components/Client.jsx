import React, { Component } from 'react'
import ReactDOM from 'react-dom';


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
      routes: this.props.routes
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
    this.coords = {
      x: e.pageX,
      y: e.pageY
    }
    document.addEventListener('mousemove', this.handleMouseMove);
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

    this.props.handleMovement(data);
    this.toggleTransition();
  }

  toggleTransition() {
    this.setState({
      showTransition: !this.state.showTransition
    })
  }

  handleMouseMove(e) {

    this.toggleTransition();


    const xDiff = this.coords.x - e.pageX;
    const yDiff = this.coords.y - e.pageY;

    this.coords.x = e.pageX;
    this.coords.y = e.pageY;

    // console.log(this.props.id);
    this.setState({
      x: this.state.x - xDiff,
      y: this.state.y - yDiff
    });
  }

  toggleHidden() {
    this.setState({
      isHidden: !this.state.isHidden
    })
  }

  handleText(e) {
    this.setState({
      text: e.target.value
    })
  }

  setRouteType(e) {
    this.setState({
      routeType: e.target.value
    })
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

    const rectStyle = this.state.showTransition === true ? {
      'transition': 'all 300ms',
      'border': '1px solid #ddd'
    } : null;

    
   
    const {x, y} = this.state;
    return (
   
      <g>

        <rect
          x={x}
          y={y}
          width={this.state.animate ? 350 : 100}
          height= {this.state.animate ? 250 : 50}
          fill="yellow"
          style={rectStyle}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          // onDoubleClick={()=> this.props.handleDelete({id: this.state.id})}
          
        />
        <text x={x + 35} y={y + 20}>Client</text>
      
        <foreignObject x={x + 5} y={y + 70} width="375" height="250">
          
          {!this.state.isHidden &&
            <div>  
              <form>
                <div>
                <select value={this.state.routeType} onChange={this.setRouteType}>
                    <option> Select your route</option>
                    <option value="GET">Get</option>
                    <option value="POST"> Post</option>
                    <option value="DELETE">Delete</option>
                    <option value="PUT">Put</option>
                    <option value="OPTIONS">Options</option>
                  </select>
              
                  <input
                    placeholder='Enter endpoint details'
                    value={this.state.text}
                    onChange={this.handleText.bind(this)}>
                  </input>

                  <button
                    onClick={() => this.props.handleNewRoute({ id: this.state.id, method: this.state.routeType, url: this.state.text })}> +
                  </button>
                
                  </div>
                  {this.state.routes.map((endpoint, i) => {
                    return <div key={i}> {endpoint.method}: /{endpoint.url}</div>
                  })}
                  <button onClick={() => this.props.handleDelete({ id: this.state.id })}>Delete</button>
              </form>
              
              
            </div>
          }
        </foreignObject>
        <foreignObject x={x + 80} y={y - 10} width="15" height="15">
          <p onClick={this.startAnimation}>+</p>
        </foreignObject>
        
      </g>
    )
  }
}


export default Client;


/*
// {/* <foreignObject x={x + 5} y={y + 70} width="375" height="250">

//   {!this.state.isHidden &&
//     <div>
//       <form>
//         <div>
//           <select value={this.state.routeType} onChange={this.setRouteType}>
//             <option> Select your route</option>
//             <option value="GET">Get</option>
//             <option value="POST"> Post</option>
//             <option value="DELETE">Delete</option>
//             <option value="PUT">Put</option>
//             <option value="OPTIONS">Options</option>
//           </select>

//           <input
//             placeholder='Enter endpoint details'
//             value={this.state.text}
//             onChange={this.handleText.bind(this)}>
//           </input>

//           <button
//             onClick={() => this.props.handleNewRoute({ id: this.state.id, method: this.state.routeType, url: this.state.text })}> +
//                   </button>
//         </div>
//       </form>
//       {/* {this.state.routes.map((endpoint, i) => {
//                 return <div> {endpoint.method}: {endpoint.url}</div>
//               })} */
//     </div>
//   }
// </foreignObject> */} */