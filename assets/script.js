var apiKey = "179d01a2307062deab314b97c264567ad1a85bb0c6b8d15e038453be9cee7a60";
var baseGeoUrl = "https://api.geoapify.com/v2/place-details?";
var openWeatherApiKey = "9c26d768ead86b39036caf98fb0abbfa";
var placeId, lat, lon;
var today = dayjs();
var userInput = "";
var search = $('#searchBtn');
var datesArray = $('.dates');
var artistInput = document.getElementById("artist");
var artistCardEl = document.getElementById("artistCard");
var container = document.getElementById('artist-cards-container');



function musicEvent() {
    const artistName = artistInput.value.trim();
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '39ab25d4b3mshd3d6061f56936c2p1ccea5jsn16a8b8bc255b',
            'X-RapidAPI-Host': 'concerts-artists-events-tracker.p.rapidapi.com'
        }
    };

    fetch(`https://concerts-artists-events-tracker.p.rapidapi.com/artist?name=${artistName}&page=1`, options)

        .then(response => response.json())
        .then(function (response) {
            console.log(response)

            function returnCards(response) {
                return "<div class=\"artist-cards\">" + response.data.map(valuesCard => `
    <div>
   
    <div class="artist-content">
    <h3 class=\"name-cards\"> Performing: ${valuesCard.name}</h3>
    <p>Venue: ${valuesCard.location.name}</p>
    <p>Peformance Date: ${valuesCard.startDate}</p>
    </div>
    </div>`).join('') + "</div>";
            }

            container.innerHTML = returnCards(response);
        })
        .catch(err => console.error(err));
};






function getPlaceDetails(category) {

    fetch(`${baseGeoPlacesUrl}categories=${category}&filter=place:${placeId}&apiKey=${GeoapiKey}`)
        .then(function (response) {
            if (response.ok) {
                return response.json()
            }
        })
        .then(function (data) {
            console.log(data);
            processGeoapifyPlaceDetails(data, category);
        })

}


function fetchLocation(location) {

    var geoReq = `https://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=${openWeatherApiKey}`;

    fetch(geoReq).then(function (response) {
        if (response.ok) {
            return response.json();
        }
    }).then(function (data) {
        lat = data[0].lat;
        lon = data[0].lon;
        get5Day(lat, lon);
        console.log(data)
    });

}


search.on('click', function () {
    userInput = $('#first_name').val()
    $('#current').text(userInput + " " + today.format('dddd, MMMM D'))
    console.log(userInput)
    fetchLocation(userInput)
    musicEvent(userInput)
    saveCity(userInput)
});

function saveCity(newcity) {
    let cities = JSON.parse(localStorage.getItem('saved-cities')) || []
    cities.push(newcity)
    localStorage.setItem('saved-cities', JSON.stringify(cities))
    // populateCities()
}
function populateCities(){
    let cities = JSON.parse(localStorage.getItem('saved-cities')) || []
    cities.map(function (city){
        $button = $("button")
        $button.text(city)
        $('#cities-container').append($button)
    })
}



function get5Day(lat, lon) {
    var forecastReq = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${openWeatherApiKey}`;

    fetch(forecastReq).then(function (response) {
        if (response.ok) {
            return response.json();
        }
    }).then(function (data) {
        let previousDate = ""
        const nextFivedays = []
        for (const item of data.list) {
            if (item.dt_txt.split(" ")[0] != previousDate) {
                nextFivedays.push(item)
            }
            previousDate = item.dt_txt.split(" ")[0]
        }
        populateFivedays(nextFivedays.slice(1))
        populateCurrentcity(nextFivedays[0])
    });
}


// my code

$('.dates').each(function (index, element) {
    const forecastDate = today.add(index++, "day").format('dddd, MMMM D')
    $(this).text(forecastDate)
})

function populateFivedays(data) {

    $(".forecast-container .row").each(function (index, element) {
        $(this).find("p").first().html(`Temp: ${data[index].main.temp} &#8457;`)
        $(this).find("p").last().text(`Humidity: ${data[index].main.humidity} %`)
        $(this).find("p:nth-child(3)").text(`Wind: ${data[index].wind.speed} MPH`)
    })
}

function populateCurrentcity(data) {
    $(".main-card p").first().html(`Temp: ${data.main.temp} &#8457;`)
    $(".main-card p").last().text(`Humidity: ${data.main.humidity} %`)
    $(".main-card p:nth-child(3)").text(`Wind: ${data.wind.speed} MPH`)
}