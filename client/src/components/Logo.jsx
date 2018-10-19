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
        </Typist>

       
      </div>
    );
  }
}

export default Logo;