import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
// import axios from 'axios';
import $ from 'jquery';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
// import { faHome } from '@fortawesome/fontawesome-free-solid'
import stateCenters from '../stateCenters';


class Map extends Component {

  constructor(props) {
    super(props);
    this.state = {
      bounds: [
        [-190.513578, 9.665363], // Southwest coordinates
        [-42.241805, 71.717471]  // Northeast coordinates
      ],
      centers: stateCenters,
    }
    console.log(props)
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.map) {
      this.state.map.flyTo({
        center: nextProps.center,
        zoom: nextProps.zoom,
        pitch: 0,
        bearing: 0,
      });

      if (nextProps.zoom < 4.5) {
        this.state.map.setPaintProperty("state-fills-hover", 'fill-opacity', 0.3);
      } else {
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
      center: this.props.center,
      zoom: this.props.zoom,
      maxBounds: this.state.bounds
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
        this.props.onStateClick(e.features[0].properties.name);
      });

      // TODO - Fade reset button in and out
      // map.on('moveend', () => {
      //   $('#reset').fadeIn(200);
      // });


      /***************************************CONGRESS BUBBLES**************************************/
      map.addSource("legislators", {
          "type": "geojson",
          "data": "./legislators.geojson"
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

      map.on('click', 'legislators', function (e) {
          console.log(e.features[0].properties)
          e.features[0].properties.firstlast = e.features[0].properties.first_name + ' ' + e.features[0].properties.last_name
          e.features[0].properties.cid = e.features[0].properties.opensecrets_id
          map.flyTo({
              center: e.features[0].geometry.coordinates,
              zoom: 10,
          });
      });
    });
  }

  render() {
    return (
      <div>
        <div id="map"></div>
        <button type="button" className="btn btn-light" id="reset" onClick={this.props.reset}><FontAwesomeIcon icon='home' /></button>
      </div>
    );
  }
}

export default Map;
