import React, { Component } from 'react';
import axios from 'axios';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import '@fortawesome/fontawesome-free-solid'


class Sidebar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      view: null,
    }
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="App">
        <Map/>
        <div id="brand">
          <h1 id="logo">ReInform</h1>
          <Info/>
        </div>
      </div>
    );
  }
}

export default Sidebar;
