import React, { Component } from 'react';
import stateNames from '../data/stateAbbrevs';
import LoadingAnimation from './LoadingAnimation';

class State extends Component {

  constructor(props) {
    super(props);

    this.state = {
      legislators: null,
    }
  }

  componentDidUpdate() {
    // this.setState({
    //   legislators: null,
    // })
  }

  Legislators = () => {
    // const abbrev = stateAbbrevs[this.props.currState];
    // axios.get('/state/' + abbrev).then((response) => {
    //   this.setState({
    //     legislators: response.data.response.legislator
    //   })
    // });
    // console.log(this.state);
    if (this.state.legislators == null) {
      return (
        <LoadingAnimation/>
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <div id="sidebar">
        <h2 id="sidebar-title">{stateNames[this.props.selectedState]}</h2>
        <div id="sidebar-body" className="scrollbar style-1">
          <this.Legislators />
        </div>
      </div>
    );
  }
}

export default State;
