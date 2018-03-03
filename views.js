mapboxgl.accessToken = 'pk.eyJ1IjoiYnJpYW55dSIsImEiOiJjajVycTJ0cTMwemt0MzNwbGQxN3JvbWF5In0.YddKaK6iFrT0IG1JVU8mUQ';

var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/streets-v10',
	center: [-95.486052, 37.830348],
    zoom: 4
});

map.on('load', function () {
    map.addSource("states", {
        "type": "geojson",
        "data": "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_1_states_provinces.geojson"
    });

    map.addLayer({
        "id": "state-fills",
        "type": "fill",
        "source": "states",
        "layout": {},
        "paint": {
            "fill-color": "#627BC1",
            "fill-opacity": 0.5
        }
    });

    map.addLayer({
        "id": "state-borders",
        "type": "line",
        "source": "states",
        "layout": {},
        "paint": {
            "line-color": "#627BC1",
            "line-width": 2
        }
    });

    map.addLayer({
        "id": "state-fills-hover",
        "type": "fill",
        "source": "states",
        "layout": {},
        "paint": {
            "fill-color": "#627BC1",
            "fill-opacity": 1
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
});