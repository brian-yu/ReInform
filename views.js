mapboxgl.accessToken = 'pk.eyJ1Ijoiam9hbm5hamlhIiwiYSI6ImNqZWJyeXk0dDFncWUzM28xOXQzNnkyZ2sifQ.1Bb_AA5tFy8jR_bQgLzAPA';
currentState = "";

var initCenter = [-94.7, 37.830348];
var initZoom = 3.75;

$('#reset').hide();

// function initSidebar() {
// 	$("#sidebar-title").text("State Search");
// 	$("#sidebar-body").text("Welcome to AccountaBill!")
// }

var sidebar = new Vue({
  el: '#sidebar',
  data: {
    title: 'Welcome!',
    body: 'Hello world.',
    view: "country",
    items: [],
  }
})

var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/joannajia/cjec5ifih1rzl2ro3kw935rhm',
	center: initCenter,
    zoom: initZoom
});

function resetView() {
	map.flyTo({
        center: initCenter,
        zoom: initZoom,
    });
	$('#reset').fadeOut(200);
}

function resetListener(e) {
	if (map.getZoom() != initZoom) {
    	$('#reset').fadeIn(200);
    }
    // } else if (arraysEqual(map.getCenter(), initCenter) && map.getZoom() == initZoom) {
    // 	$('#reset').hide();
    // }
}

function stateView(name, abbrev) {
	sidebar.title = name;
	sidebar.view = "state";
	axios.get('http://localhost:5000/state/' + abbrev)
  		.then(function (response) {
    	sidebar.items = response.data.response.legislator;
  	});
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
        map.on('zoomend', function() {
    	if (coordsSimilar(map.getCenter(), initCenter)) {
    		$("#reset").hide();
    	}
    })
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
        // console.log(centers[e.features[0].properties.name])
        console.log(e.features[0].properties)
        map.flyTo({
	        center: centers[e.features[0].properties.name],
	        zoom: 6,
    	});
    	stateView(e.features[0].properties.name, e.features[0].properties.code_hasc.substring(3));
    });

    map.on('zoomend', resetListener);

});