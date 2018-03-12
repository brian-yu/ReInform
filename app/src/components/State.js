import React, { Component } from 'react';
import stateNames from '../data/stateAbbrevs';
import LoadingAnimation from './LoadingAnimation';
import './State.css';

class State extends Component {

  onCongressmanClick = (bid) => {
    this.props.onCongressmanClick(bid)
    this.props.fetchCongressmanIfNeeded(bid)
  }

  Legislators = (props) => {
    if (!this.props.dataByState[this.props.selectedState]) {
      return (
        <LoadingAnimation/>
      );
    } else if (this.props.dataByState[this.props.selectedState].isFetching) {
      return (
        <LoadingAnimation/>
      );
    } else {
      console.log(this.props.dataByState[this.props.selectedState])
      console.log(this.props.chamber)
      const congressmen = this.props.dataByState[this.props.selectedState]
        .data[props.chamber].map((congressman) => {
          // const pic_url = `https://theunitedstates.io/images/congress/225x275/${congressman.bioguide_id}.jpg`
          return (
            <li key={congressman.id}>
              {/*<img src={pic_url}/>*/}
              <div onClick={() => this.onCongressmanClick(congressman.id)}>
                {congressman.name} - <span className={congressman.party}>({congressman.party})</span>
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
          <h4>Senators</h4>
          <this.Legislators chamber="senate" />
          <h4>Representatives</h4>
          <this.Legislators chamber="house" />
        </div>
      </div>
    );
  }
}

export default State;
