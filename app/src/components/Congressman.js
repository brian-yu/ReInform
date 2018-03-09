import React, { Component } from 'react';
import axios from 'axios';

class Congressman extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    return (
      <div id="sidebar">
        <h2 id="sidebar-title">{this.props.currCid}</h2>
        <div id="sidebar-body" className="scrollbar style-1">
          
        </div>
      </div>
    );
  }
}

export default Congressman;
