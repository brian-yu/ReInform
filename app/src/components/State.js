import React, { Component } from 'react';
import stateNames from '../data/stateAbbrevs';
import LoadingAnimation from './LoadingAnimation';
import './State.css';

class State extends Component {

  Legislators = () => {
    if (!this.props.dataByState[this.props.selectedState]) {
      return (
        <LoadingAnimation/>
      );
    } else if (this.props.dataByState[this.props.selectedState].isFetching) {
      return (
        <LoadingAnimation/>
      );
    } else {
      const congressmen = this.props.dataByState[this.props.selectedState]
        .data.map((congressman) => {
          // const pic_url = `https://theunitedstates.io/images/congress/225x275/${congressman.bioguide_id}.jpg`
          return (
            <li key={congressman.cid}>
              {/*<img src={pic_url}/>*/}
              <div onClick={() => this.props.onCongressmanClick(congressman.bioguide_id)}>
                {congressman.firstlast} - <span className={congressman.party}>({congressman.party})</span>
              </div>
            </li>
          )
        }
      );
      return (
        <ul className="congressList">
          {congressmen}
        </ul>
      );
    }
  }

  

  render() {
    return (
      <div id="sidebar">
        <h2 id="sidebar-title">{stateNames[this.props.selectedState]}</h2>
        <div id="sidebar-body" className="scrollbar style-1">
          <h4>Congressmen</h4>
          <this.Legislators />
        </div>
      </div>
    );
  }
}

export default State;
