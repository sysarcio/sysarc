import React, { Component } from 'react';
import random from 'lodash/random';
import sampleSize from 'lodash/sampleSize';
import Typist from 'react-typist';


class Logo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }


  render() {
    return (
      <div>
        <Typist className='logo'>
          Sketchpad Ninja 
<<<<<<< HEAD
          <Typist.Delay ms={300} />
          <br />
          <h2 className='hello'>Hello.</h2>
            
=======
>>>>>>> 6be7715abc10fed59b8e78b1470f9a8b6e86667b
        </Typist>

       
      </div>
    );
  }
}

export default Logo;