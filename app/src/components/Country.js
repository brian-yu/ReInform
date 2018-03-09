import React, { Component } from 'react';

class Country extends Component {

  render() {
    return (
      <div id="sidebar">
        <h2 id="sidebar-title">United States</h2>
        <div id="sidebar-body" className="scrollbar style-1">
          <p>There are 535 congressmen in the United States.</p>
          <p>In the 2018 cycle, members of congress have accepted <b>$12,204,235</b> of funding so far.</p>
          <p>In the 2016 cycle, they accepted <b>$30,914,976</b> in funding.</p>
          <h5>Our Mission</h5>
          <p>We built <b>ReInform</b> to help voters learn more about their congressmen, <b>increase political transparency</b>, and give people the <b>power of information</b>.</p>
          <h5>How to Use</h5>
          <p>To get started learning about your Congressman's voting history and funding sources, <b>click on your state</b> on the map.</p>
        </div>
      </div>
    );
  }
}

export default Country;
