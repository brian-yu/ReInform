import React, { Component } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import '@fortawesome/fontawesome-free-solid'
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';


class Info extends Component {

	constructor(props) {
		super(props);
		this.state = {
			infoOpen: false
		}
	}

	infoToggle = () => {
    	this.setState((prevState) => ({
      		infoOpen: !prevState.infoOpen
    	}));
  	}

  	render() {
  		return (
  			<span>
	            <FontAwesomeIcon id="info" icon="info-circle" onClick={this.infoToggle}/>
	  			<Popover placement="right" isOpen={this.state.infoOpen} target="info" toggle={this.infoToggle}>
	              <PopoverHeader>
	                <span>A word from the team</span> <button type="button" id="info-close" className="close" onClick={this.infoToggle}>&times;</button>
	              </PopoverHeader>
	              <PopoverBody>
	                Hey. We're <a target='blank' href='https://byu.io'>Brian</a>, <a target='blank' href='https://rashidlasker.github.io'>Rashid</a>, <a target='blank' href='https://github.com/tsingh2017'>Tarun</a>, <a target='blank' href='https://github.com/joannajia'>Joanna</a>, and <a target='blank' href='https://github.com/HarunFeraidon'>Harun</a> and we built ReInform to <b>reform the way we inform people about politics</b>.<br/><br/> All of our data is from non-partisan sources like <a target='blank' href='https://www.opensecrets.org/'>OpenSecrets</a>, <a target='blank' href='https://www.propublica.org/'>ProPublica</a>, and <a target='blank' href='http://bioguide.congress.gov/biosearch/biosearch.asp'>Congressional BioGuide</a>.
	              </PopoverBody>
	            </Popover>
	        </span>
  		);
  	}

}

export default Info;