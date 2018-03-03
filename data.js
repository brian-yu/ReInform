
var OPEN_SECRETS_KEY = "40411c191fd58f5709214a9184c9ca1d";

function getLegislators(state, func) {
	$.getJSON("http://www.opensecrets.org/api/?method=getLegislators&id=" + state + "&apikey=" + OPEN_SECRETS_KEY, function(data) {
		func(data);
	});
}

$.getJSON("http://localhost:5000/state/va", function(data) {
	console.log(data);
});