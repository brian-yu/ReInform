import React, { Component } from 'react';
import './LoadingAnimation.css';

class LoadingAnimation extends Component {
  render() {
    return (
	    <div id="loading" className="spinner">
	      <div className="rect1"></div>
	      <div className="rect2"></div>
	      <div className="rect3"></div>
	      <div className="rect4"></div>
	      <div className="rect5"></div>
	    </div>
	);
  }
}

export default LoadingAnimation;
