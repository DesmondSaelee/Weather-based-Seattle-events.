var apiKey = "179d01a2307062deab314b97c264567ad1a85bb0c6b8d15e038453be9cee7a60";
var baseGeoUrl = "https://api.geoapify.com/v2/place-details?";
var serpApiKey = "39ab25d4b3mshd3d6061f56936c2p1ccea5jsn16a8b8bc255b";
var openWeatherApiKey = "9c26d768ead86b39036caf98fb0abbfa";

var placeId, lat, lon;
var today = dayjs();
var userInput = ""
var search = $('#searchBtn')
var datesArray = $('.dates')

// $('#current').append(today.format('dddd, MMMM D'));

// const SerpApi = require('google-search-results-nodejs');
// const search = new SerpApi.GoogleSearch("xbfOzxgGLCmOGOhoRvKLZr6OzSHd1qus");

// const params = {
//   engine: "google_events",
//   q: "Events in Austin",
//   hl: "en",
//   gl: "us"
// };

// const callback = function(data) {
//   console.log(data["events_results"]);
// };


// search.json(params, callback);

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '39ab25d4b3mshd3d6061f56936c2p1ccea5jsn16a8b8bc255b',
		'X-RapidAPI-Host': 'concerts-artists-events-tracker.p.rapidapi.com'
	}
};

fetch('https://concerts-artists-events-tracker.p.rapidapi.com/venue?name=Hollywood%20bowl&page=1', options)
	.then(response => response.json())
	.then(function(response){
        console.log(response)
        for (var i = 0; i < response.data.length; i++) {
            console.log(response.data[i].description)
            // Put everything within the for loop between starting on line 43 and ending on 47. create elements and append to desired cards.

        }
       

    })
	.catch(err => console.error(err));

  
    
// function fetchLocationData(location){
    
//     var requestOptions = { 
//         mode: "no-cors",
//         method: 'GET',
//     };
    
//     fetch(`https://concerts-artists-events-tracker.p.rapidapi.com/venue`, requestOptions)
//     .then(response => response.json())
//     .then(function(result){
//         placeId = result.features[0].properties.place_id;
//         lat = result.features[0].properties.lat;
//         lon = result.features[0].properties.lon;
//         console.log("This is example" + result)
//     })
//     .catch(error => console.log('error', error));

// }
// fetchLocationData();

function getPlaceDetails(){

    fetch(`${baseGeoUrl}filter=place:${placeId}&apiKey=${apiKey}`)
    .then(function(response){
        if(response.ok){return response.json()}
    })
    .then(function(data){
        console.log(data);
    })

}


function fetchLocation(location){

    var geoReq = `https://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=${openWeatherApiKey}`;

    fetch(geoReq).then(function(response){
        if(response.ok){
            return response.json();
        }
    }).catch(function(error){
        console.error('Error: ' + error);
    }).then(function(data){
        let lat = data[0].lat;
        let lon = data[0].lon;
        get5Day(lat, lon);

    });

}


function get5Day(lat, lon){
    var forecastReq = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${openWeatherApiKey}`;

    fetch(forecastReq).then(function(response){
        if(response.ok){
            return response.json();
        }
    }).then(function(data){
        console.log(data);
    });
}

fetchLocation("seattle")
search.on('click', function () {
  userInput = $('#first_name').val()
  $('#current').text(userInput + " " + today.format('dddd, MMMM D'))
  console.log(userInput)
  
  
  });
// const tomorrow = today.add(1,"day").format('dddd, MMMM D')
// console.log(tomorrow)

for (let index = 0; index < datesArray.length; index++) {
    const forecastIndex = datesArray[index];
    const forecastDate = today.add(index++,"day").format('dddd, MMMM D')
    $('.dates').text(forecastDate)
    
}

