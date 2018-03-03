mapboxgl.accessToken = 'pk.eyJ1IjoiYnJpYW55dSIsImEiOiJjajVycTJ0cTMwemt0MzNwbGQxN3JvbWF5In0.YddKaK6iFrT0IG1JVU8mUQ';
currentState = "";

var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/streets-v10',
	center: [-95.486052, 37.830348],
    zoom: 3.75
});

function setSidebar(title, body) {
	$("#sidebar-title").text(title)
	$("#sidebar-body").text(body)
}

function stateView(name, abbrev) {
	if (name !== currentState) {
		abbrev = abbrev.substring(3)
		console.log(abbrev)
		$.getJSON("http://localhost:5000/state/" + abbrev, function(data) {
			// console.log(data);
			setSidebar(name, data);
			console.log(data);
		});
	// setSidebar(stateName, )
		currentState = name;
	}
}

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
            "fill-opacity": 0.0
        }
    });

    // map.addLayer({
    //     "id": "state-borders",
    //     "type": "line",
    //     "source": "states",
    //     "layout": {},
    //     "paint": {
    //         "line-color": "#627BC1",
    //         "line-width": 1
    //     }
    // });

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
    });

    // Reset the state-fills-hover layer's filter when the mouse leaves the layer.
    map.on("mouseleave", "state-fills", function() {
        map.setFilter("state-fills-hover", ["==", "name", ""]);
    });

    map.on('click', 'state-fills', function (e) {
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
    });
});