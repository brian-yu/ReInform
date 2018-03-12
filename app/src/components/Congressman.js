import React, { Component } from 'react';
import LoadingAnimation from './LoadingAnimation';
import './Congressman.css';
import stateNames from '../data/stateAbbrevs';
import LESByCongressman from '../data/les';

class Congressman extends Component {

	LES(props) {
		if (props.les === "-1") {
			return null;
		} else {
			return (
				<div id="les">
		  		<h5>Legislative Effectiveness</h5>
		  		<p>{props.les}</p>
		  	</div>
			)
		}
	}

	Bills(props) {
		if (props.bills.length === 0) {
			return null;
		} else {
			const bills = props.bills.map((bill) => {
          // const pic_url = `https://theunitedstates.io/images/congress/225x275/${congressman.bioguide_id}.jpg`
          return (
            <li key={bill.bill_id} className="bill">
              {/*<img src={pic_url}/>*/}
              <a href={bill.govtrack_url} target="_blank">
					    	{bill.latest_major_action_date}: {bill.primary_subject}
					    	{/*{bill.latest_major_action_date}: {bill.short_title}*/}
							</a>
            </li>
          )
        }
      );
			return (
				<div id="bills">
					<h5>Recent Bills</h5>
					<ul>
						{bills}
					</ul>
				</div>
			)
		}
	}

	Funding(props) {
		if (props.funding.length === 0) {
			return null;
		} else {
			const funding = props.funding.map((fund) => {
          // const pic_url = `https://theunitedstates.io/images/congress/225x275/${congressman.bioguide_id}.jpg`
          return (
            <li key={fund.org_name} className="fund">
              ${fund.total} - {fund.org_name}
            </li>
          )
        }
      );
			return (
				<div id="funding">
					<h5>2018 Cycle Funding</h5>
					<ul>
						{funding}
					</ul>
				</div>
			)
		}
	}

	Info = () => {
		if (!this.props.dataByCongressman[this.props.selectedCongressman]) {
      return (
        <div id="sidebar">
	        <h2 id="sidebar-title">
	        	{/*<LoadingAnimation/>*/}
	        </h2>
	        <div id="sidebar-body" className="scrollbar style-1">
	          <LoadingAnimation/>
	        </div>
	      </div>
      );
    } else if (this.props.dataByCongressman[this.props.selectedCongressman].isFetching) {
      return (
        <div id="sidebar">
	        <h2 id="sidebar-title">
	        	{/*<LoadingAnimation/>*/}
	        </h2>
	        <div id="sidebar-body" className="scrollbar style-1">
	          <LoadingAnimation/>
	        </div>
	      </div>
      );
    } else {
      // console.log(this.props.dataByState[this.props.selectedState])
      // console.log(this.props.chamber)
      const member = this.props.dataByCongressman[this.props.selectedCongressman].data;
      return (
	      <div id="sidebar">
	        <h2 id="sidebar-title">{`${member.first_name} ${member.last_name}`}</h2>
	        <div id="sidebar-body" className="scrollbar style-1">
	        	<img className="portrait" src={`https://theunitedstates.io/images/congress/225x275/${this.props.selectedCongressman}.jpg`} alt="/static/image/default_profile.jpg"/>
				  	<p>{`${member.first_name} ${member.last_name}`} is a <span className={member.current_party}>{member.current_party === "D" ? "Democratic" : "Republican"}</span> congressman from {stateNames[this.props.selectedState]}.</p>
				  	<this.LES les={LESByCongressman[this.props.selectedCongressman]}/>
				  	<this.Bills bills={member.bills}/>
				  	<this.Funding funding={member.funding2018}/>
				  	{/*<p style="margin-bottom: 0">Legislative Effectiveness Score:</p>
				  	<p v-if="les=='-1'" align="center">Not enough information</p>
				  	<h4 v-else-if="les!=''" align="center">{{les}}</h4>
				  	<div id="social">
				  		<a v-bind:href="phone"><i class="fa fa-phone-square" aria-hidden="true"></i></a>
				  		<a v-bind:href="fb"><i class="fa fa-facebook-official" aria-hidden="true"></i></a>
				  		<a v-bind:href="twitter"><i class="fa fa-twitter-square" aria-hidden="true"></i></a>
				  		<a v-bind:href="website"><i class="fa fa-link"></i></a>
				  	</div>
				  	<div id="funding">
				  		<h5>2018 Cycle Funding</h5>
						<div id="loading" class="spinner" v-if="orgs.length == 0">
						  <div class="rect1"></div>
						  <div class="rect2"></div>
						  <div class="rect3"></div>
						  <div class="rect4"></div>
						  <div class="rect5"></div>
						</div>
				  		<ul>
						  <li v-for="org in orgs">
						  	${{org['@attributes'].total}} - {{org['@attributes'].org_name}}
						  </li>
						</ul>
				  	</div>
				  	<div id="views">
				  		<h5>Viewpoints</h5>
						<div id="loading" class="spinner" v-if="views.length == 0">
						  <div class="rect1"></div>
						  <div class="rect2"></div>
						  <div class="rect3"></div>
						  <div class="rect4"></div>
						  <div class="rect5"></div>
						</div>
				  		<ul v-for="v in views">
				  			<h6 style="text-decoration: underline;">{{v.issueName}}</h6>
						  	<li v-for="iv in v.views">
						    	{{iv}}
						  	</li>
						</ul>
				  	</div>*/}
	        </div>
	      </div>
      )
    }
	}


  render() {
    return (
      <this.Info/>
    );
  }
}

export default Congressman;
