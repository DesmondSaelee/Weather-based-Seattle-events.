var apiKey = "7fd817a82bee4b8fbce597d0849507d8";
var baseGeoUrl = "https://api.geoapify.com/v2/place-details?";
var serpApiKey = "179d01a2307062deab314b97c264567ad1a85bb0c6b8d15e038453be9cee7a60";
var openWeatherApiKey = "9c26d768ead86b39036caf98fb0abbfa";

var placeId, lat, lon;

var today = dayjs();
    
function fetchLocationData(location){
    
    var requestOptions = {
        method: 'GET',
    };
    
    fetch(`https://api.geoapify.com/v1/geocode/search?text=${location}&apiKey=${apiKey}`, requestOptions)
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