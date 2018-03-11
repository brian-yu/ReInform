import React, { Component } from 'react';
import StateContainer from '../containers/StateContainer';
import CongressmanContainer from '../containers/CongressmanContainer';
import Country from './Country';
import './Sidebar.css';

class Sidebar extends Component {
  render() {
    if (this.props.view === "country") {
      return <Country/>
    } else if (this.props.view === "state") {
      return <StateContainer/>
    } else if (this.props.view === "congressman") {
      return <CongressmanContainer/>
    }
  }
}

export default Sidebar;
