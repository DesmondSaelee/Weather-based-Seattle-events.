var apiKey = "7fd817a82bee4b8fbce597d0849507d8";
var baseGeoUrl = "https://api.geoapify.com/v2/place-details?";

var placeId, lat, lon;

var today = dayjs();
today.set('date', today.get('day') + 1);

console.log(today.format('dddd, MMM D'));
    
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
