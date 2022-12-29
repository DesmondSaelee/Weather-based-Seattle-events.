var apiKey = "179d01a2307062deab314b97c264567ad1a85bb0c6b8d15e038453be9cee7a60";
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
    
    fetch(`https://serpapi.com/search.json?engine=google_events&q=Events+in+Austin&hl=en&gl=us`, requestOptions)
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
    const forecastIndex = datesArray[index];
    const forecastDate = today.add(index++,"day").format('dddd, MMMM D')
    $('.dates').text(forecastDate)
    
}

