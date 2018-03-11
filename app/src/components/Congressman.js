import React, { Component } from 'react';

class Congressman extends Component {

  render() {
    return (
      <div id="sidebar">
        <h2 id="sidebar-title">{this.props.selectedCongressman}</h2>
        <div id="sidebar-body" className="scrollbar style-1">
          
        </div>
      </div>
    );
  }
}

export default Congressman;
