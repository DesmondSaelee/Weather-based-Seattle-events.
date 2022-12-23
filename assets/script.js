var apiKey = "7fd817a82bee4b8fbce597d0849507d8";
var baseGeoUrl = "https://api.geoapify.com/v2/place-details?";

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
    
    fetch(`https://api.geoapify.com/v1/geocode/search?text=${location}&apiKey=${apiKey}`, requestOptions)
    .then(response => response.json())
    .then(function(result){
        placeId = result.features[0].properties.place_id;
        lat = result.features[0].properties.lat;
        lon = result.features[0].properties.lon;
    })
    .catch(error => console.log('error', error));

}
search.on('click', function () {
  userInput = $('#first_name').val()
  $('#current').text(userInput + " " + today.format('dddd, MMMM D'))
  console.log(userInput)
  
  });
// const tomorrow = today.add(1,"day").format('dddd, MMMM D')
// console.log(tomorrow)

for (let index = 0; index < datesArray.length; index++) {
    const element = datesArray[index];
    const forecastDate = today.add(index+1,"day").format('dddd, MMMM D')
    element.text(forecastDate)
}

