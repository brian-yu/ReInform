import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
// import axios from 'axios';
import $ from 'jquery';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
// import { faHome } from '@fortawesome/fontawesome-free-solid'



class Map extends Component {

  constructor(props) {
    super(props);
    this.state = {
      initCenter: [-94.7, 37.830348],
      initZoom: 3.75,
      bounds: [
        [-190.513578, 9.665363], // Southwest coordinates
        [-42.241805, 71.717471]  // Northeast coordinates
      ],
      centers: {
        "Alaska": [-152.2782, 64.0685],
        "North Dakota": [-100.4659, 47.4501],
        "Washington": [-120.4472, 47.3826],
        "Montana": [-109.6333, 47.0527],
        "Minnesota": [-94.3053, 46.2807],
        "Maine": [-69.2428, 45.3695],
        "Wisconsin": [-89.9941, 44.6243],
        "South Dakota": [-100.2263, 44.4443],
        "Idaho": [-114.6130, 45.3509],
        "Michigan": [-85.4102, 44.3467],
        "Vermont": [-72.6658, 44.0687],
        "Oregon": [-120.5583, 43.9336],
        "New Hampshire": [-71.5811, 43.6805],
        "Wyoming": [-107.5512, 42.9957],
        "New York": [-75.5268, 42.9538],
        "Massachusetts": [-71.8083, 42.2596],
        "Iowa": [-93.4960, 42.0751],
        "Rhode Island": [-71.5562, 41.6762],
        "Connecticut": [-72.7273, 41.6219],
        "Nebraska": [-99.7951, 41.5378],
        "Pennsylvania": [-77.7996, 40.8781],
        "Ohio": [-82.7937, 40.2862],
        "New Jersey": [-74.6728, 40.1907],
        "Illinois": [-89.1965, 40.0417],
        "Indiana": [-86.2816, 39.8942],
        "Nevada": [-116.6312, 39.3289],
        "Utah": [-111.6703, 39.3055],
        "Maryland": [-76.7909, 39.0550],
        "Colorado": [-105.5478, 38.9972],
        "Delaware": [-75.5050, 38.9896],
        "District of Columbia": [-77.0147, 38.9101],
        "West Virginia": [-80.6227, 38.6409],
        "Kansas": [-98.3804, 38.4937],
        "Missouri": [-92.4580, 38.3566],
        "Kentucky": [-85.3021, 37.5347],
        "Virginia": [-78.8537, 37.5215],
        "California": [-119.4696, 37.1841],
        "Tennessee": [-86.3505, 35.8580],
        "Oklahoma": [-97.4943, 35.5889],
        "North Carolina": [-79.3877, 35.5557],
        "Arkansas": [-92.4426, 34.8938],
        "New Mexico": [-106.1126, 34.4071],
        "Arizona": [-111.6602, 34.2744],
        "South Carolina": [-80.8964, 33.9169],
        "Alabama": [-86.8287, 32.7794],
        "Mississippi": [-89.6678, 32.7364],
        "Georgia": [-83.4426, 32.6415],
        "Texas": [-99.3312, 31.4757],
        "Louisiana": [-91.9968, 31.0689],
        "Florida": [-82.4497, 28.6305],
        "Hawaii": [-156.3737, 20.2927],
      },
    }
  }

  reset = () => {
    this.state.map.flyTo({
        center: this.state.initCenter,
        zoom: this.state.initZoom,
        pitch: 0, // pitch in degrees
        bearing: 0,
    });
    $('#reset').fadeOut(200);
    this.state.map.setPaintProperty("state-fills-hover", 'fill-opacity', 0.3);
  }

  componentDidMount() {
    // Initialize Map
    mapboxgl.accessToken = 'pk.eyJ1Ijoiam9hbm5hamlhIiwiYSI6ImNqZWJyeXk0dDFncWUzM28xOXQzNnkyZ2sifQ.1Bb_AA5tFy8jR_bQgLzAPA';
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/joannajia/cjec5ifih1rzl2ro3kw935rhm',
      center: this.state.initCenter,
      zoom: this.state.initZoom,
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
          // console.log(e.features[0].properties)
          // $("#sidebar-title").text(e.features[0].properties.name)
          // stateView(e.features[0].properties.name, e.features[0].properties.code_hasc)
          // map.on('zoomend', function() {
        // if (coordsSimilar(map.getCenter(), initCenter)) {
        //   $("#reset").hide();
        // }
      // })
      });

      // Reset the state-fills-hover layer's filter when the mouse leaves the layer.
      map.on("mouseleave", "state-fills", function() {
          map.setFilter("state-fills-hover", ["==", "name", ""]);
      });

      map.on('click', 'state-fills', (e) => {
          // var coordinates = e.features[0].geometry.coordinates.slice();
          // var description = e.features[0].properties.description;

          // Ensure that if the map is zoomed out such that multiple
          // copies of the feature are visible, the popup appears
          // over the copy being pointed to.
          // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          //     coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          // }

          // new mapboxgl.Popup()
          //     .setLngLat(coordinates)
          //     .setHTML(description)
          //     .addTo(map);
          console.log(e.features[0].properties.name + " " + e.features[0].properties.code_hasc)
          // console.log(centers[e.features[0].properties.name])
          console.log(e.features[0].properties)
          // if (e.features[0].properties.name !== sidebar.stateName) {
          //     sidebar.items = [];
          // }
          map.flyTo({
            center: this.state.centers[e.features[0].properties.name],
            zoom: 6,
        });
          map.setPaintProperty("state-fills-hover", 'fill-opacity', 0);
        // sidebar.renderState(e.features[0].properties.name, e.features[0].properties.code_hasc.substring(3));
      });

      map.on('moveend', () => {
        $('#reset').fadeIn(200);
      });


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
          // console.log(e.features[0].properties)
          e.features[0].properties.firstlast = e.features[0].properties.first_name + ' ' + e.features[0].properties.last_name
          e.features[0].properties.cid = e.features[0].properties.opensecrets_id
          map.flyTo({
              center: e.features[0].geometry.coordinates,
              zoom: 10,
          });
          // sidebar.renderCongressman(e.features[0].properties)
          // sidebar.renderCongressmanFromId(e.features[0].properties);
          // sidebar.les = e.features[0].properties.les;
      });
    });
  }

  render() {
    return (
      <div>
        <div id="map"></div>
        <button type="button" className="btn btn-light" id="reset" onClick={this.reset}><FontAwesomeIcon icon='home' /></button>
      </div>
    );
  }
}

export default Map;
