import React, { Component } from 'react';
import Congressman from './Congressman';
import State from './State';
import Country from './Country';

class Sidebar extends Component {
  render() {
    if (this.props.view === "country") {
      return <Country/>
    } else if (this.props.view === "state") {
      return <State currState={this.props.currState}/>
    } else if (this.props.view === "congressman") {
      return <Congressman currCid={this.props.currCid}/>
    }
  }
}

export default Sidebar;
