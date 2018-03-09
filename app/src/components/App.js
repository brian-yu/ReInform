import React, { Component } from 'react';
// import axios from 'axios';
// import FontAwesomeIcon from '@fortawesome/react-fontawesome'
// import '@fortawesome/fontawesome-free-solid'
import './App.css';
import Map from './Map';
import MapContainer from '../containers/MapContainer';
import SidebarContainer from '../containers/SidebarContainer';
import Info from './Info';


class App extends Component {

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
        <MapContainer/>
        <div id="brand">
          <h1 id="logo">ReInform</h1>
          <Info/>
        </div>
        <SidebarContainer/>
      </div>
    );
  }
}

export default App;
