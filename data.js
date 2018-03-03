
var API_KEY = "40411c191fd58f5709214a9184c9ca1d"


// var xhttp = new XMLHttpRequest();
// xhttp.onreadystatechange = function() {
// if (this.readyState == 4 && this.status == 200) {
//   console.log(this.responseText);
// }
// };

// xhttp.open("GET", "http://localhost:5000/state/va", true);
// xhttp.send();


$.getJSON("http://localhost:5000/state/va", function(data) {
	console.log(data);
});