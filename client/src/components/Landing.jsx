
import React, { Component } from 'react';
import axios from 'axios';
import Signup from './Signup.jsx';
import Login from './Login.jsx';
import LandingInfo from './LandingInfo.jsx';
import Logo from './Logo.jsx'
import SignUp from './Signup.jsx';




class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
     
    };
  }

  render() {

    return(

      <div>
        <button className='login-btn'>Login</button>
        <button className='signin-btn'>Signup</button>
       
       {/* <h1 className='logo'>Sketchpad Ninja</h1> */}
 
       <Logo />
       <LandingInfo />
       
      </div>
    );
  }

}

export default Landing;

//   <section className="row">
//     <div className="grid">

//     <h1 className='logo'>Sketchpad Ninja</h1>

// {/* <section className="row">
//   <div className="grid">

//     <section className="teaser col-1-3">
//       <h3>Design your system architecture lightening fast</h3>
//       {/* <img src={'/static/images/Canvas-Ex-White.png'} width="200" height="150" alt="Example System Architecture" /> */}
//     </section>

//     <section className="teaser col-1-3">
//       <h3>Collaborate with your teams in real time</h3>
//     </section>

//     <section className="teaser col-1-3">
//       <h3>Generate Swagger compliant documents instantly</h3>
//     </section>

//   </div>
// </section > */}
//    </div>
//   </section>



// {/* <div className='benefits-wrapper'>
//           <p>Design your system architecture lightening fast</p>
//           <p>Collaborate with your teams in real time</p> 
//           <p>Generate Swagger compliant docs instantly</p> 
//         </div> */}