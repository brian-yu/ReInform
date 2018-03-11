import React, { Component } from 'react';
import Congressman from './Congressman';
import State from './State';
import Country from './Country';

class Sidebar extends Component {
  render() {
    if (this.props.view === "country") {
      return <Country/>
    } else if (this.props.view === "state") {
      return <State selectedState={this.props.selectedState}/>
    } else if (this.props.view === "congressman") {
      return <Congressman selectedCongressman={this.props.selectedCongressman}/>
    }
  }
}

export default Sidebar;
