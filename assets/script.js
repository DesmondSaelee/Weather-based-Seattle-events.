var apiKey = "179d01a2307062deab314b97c264567ad1a85bb0c6b8d15e038453be9cee7a60";
var baseGeoUrl = "https://api.geoapify.com/v2/place-details?";
var serpApiKey = "179d01a2307062deab314b97c264567ad1a85bb0c6b8d15e038453be9cee7a60";
var openWeatherApiKey = "9c26d768ead86b39036caf98fb0abbfa";

var placeId, lat, lon;
var today = dayjs();
var userInput = ""
var search = $('#searchBtn')
var datesArray = $('.dates')

// $('#current').append(today.format('dddd, MMMM D'));
    
function fetchLocationData(location){
    
    var requestOptions = { 
        method: 'GET',
    };
    
    fetch(`https://serpapi.com/search.json?engine=google_events&q=Events+in+Austin&hl=en&gl=us`, requestOptions)
    .then(response => response.json())
    .then(function(result){
        placeId = result.features[0].properties.place_id;
        lat = result.features[0].properties.lat;
        lon = result.features[0].properties.lon;
        
    })
    .catch(error => console.log('error', error));

}

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

