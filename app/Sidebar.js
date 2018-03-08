import React, { Component } from 'react';
import axios from 'axios';

class Sidebar extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
  }

  render() {
    return (
      <div id="sidebar">
        <h2 id="sidebar-title">{this.state.title}</h2>
        <div id="sidebar-body" className="scrollbar style-1">
          
        </div>
      </div>
    );
  }
}

export default Sidebar;
