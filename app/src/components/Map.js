import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
// import axios from 'axios';
// import $ from 'jquery';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import stateCenters from '../data/stateCenters';
import stateNames from '../data/stateAbbrevs';
import congressmenLocations from '../data/congressmenLocations';
import legislators from '../data/legislators'
import './Map.css'

class Map extends Component {

  constructor(props) {
    super(props);
    this.state = {
      initBounds: [
        [-190.513578, 9.665363], // Southwest coordinates
        [-42.241805, 71.717471]  // Northeast coordinates
      ],
      initCenter: [-94.7, 37.830348],
      initZoom: 3.75,
    }
  }

  NavButton = () => {
    if (this.props.view === "country") {
      return null
    } else if (this.props.view === "state") {
      return (
        <button id="goBackToState" type="button" className="btn btn-primary" onClick={this.reset}>
          <FontAwesomeIcon icon='arrow-left' /> Back to USA
        </button>
      )
    } else if (this.props.view === "congressman") {
      return (
        <button id="goBackToState" type="button" className="btn btn-primary" onClick={() => this.onStateClick(this.props.selectedState)}>
          <FontAwesomeIcon icon='arrow-left' /> Back to {stateNames[this.props.selectedState]}
        </button>
      )
    }
  }

  reset = () => {
    if (this.props.view === "country") {
      this.state.map.flyTo({
        center: this.state.initCenter,
        zoom: this.state.initZoom,
        pitch: 0,
        bearing: 0,
      });
    }
    this.props.reset();
  }

  onStateClick = (abbrev) => {
    if (this.props.selectedState === abbrev) {
      this.state.map.flyTo({
        center: stateCenters[stateNames[abbrev]],
        zoom: 6,
        pitch: 0,
        bearing: 0,
      });
    }
    this.props.onStateClick(abbrev);
    // Begin fetching State data here so that it can
    // load while flyTo animation is occurring
    // Redux docs recommend separating async fetching
    // and UI actions, which seems kind of counterintuitive
    this.props.fetchStateIfNeeded(abbrev);
  }

  onCongressmanClick = (bid) => {
    // TODO - get coordinate from bioguide ID
    if (this.props.selectedCongressman === bid) {
      this.state.map.flyTo({
        // center: stateCenters[stateNames[this.props.selectedState]],
        center: congressmenLocations[this.props.selectedCongressman],
        zoom: 10,
        pitch: 0,
        bearing: 0,
      });
    }
    this.props.onCongressmanClick(bid)
    this.props.fetchCongressmanIfNeeded(bid)
  }

  componentWillUpdate(nextProps, nextState) {

    if (this.state.map) {
      // If center or zoom props change, then flyTo new position.
        if (nextProps.view === "country") {
          // View set to country
          this.state.map.flyTo({
            center: this.state.initCenter,
            zoom: this.state.initZoom,
            pitch: 0,
            bearing: 0,
          });
          this.state.map.setPaintProperty("state-fills-hover", 'fill-opacity', 0.3);
        } else if (nextProps.view === "state") {
          // View set to state
          this.state.map.flyTo({
            center: stateCenters[stateNames[nextProps.selectedState]],
            zoom: 6,
            pitch: 0,
            bearing: 0,
          });
          this.state.map.setPaintProperty("state-fills-hover", 'fill-opacity', 0);
        } else if (nextProps.view === "congressman") {
          // View set to Congressman
          this.state.map.flyTo({
            // center: stateCenters[stateNames[nextProps.selectedState]],
            center: congressmenLocations[nextProps.selectedCongressman],
            zoom: 10,
            pitch: 0,
            bearing: 0,
          });
          this.state.map.setPaintProperty("state-fills-hover", 'fill-opacity', 0);
        }
    }
  }

  componentDidMount() {
    // Initialize Map
    mapboxgl.accessToken = 'pk.eyJ1Ijoiam9hbm5hamlhIiwiYSI6ImNqZWJyeXk0dDFncWUzM28xOXQzNnkyZ2sifQ.1Bb_AA5tFy8jR_bQgLzAPA';
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/joannajia/cjec5ifih1rzl2ro3kw935rhm',
      center: this.state.initCenter,
      zoom: this.state.initZoom,
      maxBounds: this.state.initBounds
    });

    // Adding map to state
    this.setState({map: map});

    // Map setup
    map.on('load', () => {

      // Get state boundaries
      map.addSource("states", {
          "type": "geojson",
          "data": "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_1_states_provinces.geojson"
      });

      // No color layer
      map.addLayer({
          "id": "state-fills",
          "type": "fill",
          "source": "states",
          "layout": {},
          "paint": {
              "fill-color": "#627BC1",
              "fill-opacity": 0.0
          }
      });

      // Color layer
      map.addLayer({
          "id": "state-fills-hover",
          "type": "fill",
          "source": "states",
          "layout": {},
          "paint": {
              "fill-color": "#627BC1",
              "fill-opacity": 0.3
          },
          "filter": ["==", "name", ""]
      });
      
      // When the user moves their mouse over the states-fill layer, we'll update the filter in
      // the state-fills-hover layer to only show the matching state, thus making a hover effect.
      map.on("mousemove", "state-fills", function(e) {
          map.setFilter("state-fills-hover", ["==", "name", e.features[0].properties.name]);
      });

      // Reset the state-fills-hover layer's filter when the mouse leaves the layer.
      map.on("mouseleave", "state-fills", function() {
          map.setFilter("state-fills-hover", ["==", "name", ""]);
      });

      // Call SELECT_STATE action when state is clicked
      map.on('click', 'state-fills', (e) => {
        // console.log("STATE CLICK")
        // this.props.onStateClick(e.features[0].properties.name);
        // console.log(e.features[0].properties)
        this.onStateClick(e.features[0].properties.postal);
      });

      /***************************************CONGRESS BUBBLES**************************************/
      map.addSource("legislators", {
          "type": "geojson",
          "data": legislators
      });

      map.addLayer({
          'id': 'legislators',
          'type': 'circle',
          'source': 'legislators',
          'paint': {
              'circle-radius': 10,
              'circle-color': ['get', 'color'],
              'circle-stroke-color': '#ffffff',
              'circle-stroke-width': 2
          }
      });

      // Triggers when congressman button is clicked
      map.on('click', 'legislators', (e) => {
          this.onCongressmanClick(e.features[0].properties.bioguide_id);
      });
    });
  }

  render() {
    return (
      <div>
        <div id="map"></div>
        <button type="button" className="btn btn-light" id="reset" onClick={this.reset}><FontAwesomeIcon icon='home' /></button>
        <this.NavButton/>
      </div>
    );
  }
}

export default Map;
