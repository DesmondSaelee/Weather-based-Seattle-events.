var GeoapiKey = "7fd817a82bee4b8fbce597d0849507d8";
var baseGeoPlacesUrl = "https://api.geoapify.com/v2/places?";
var serpApiKey = "179d01a2307062deab314b97c264567ad1a85bb0c6b8d15e038453be9cee7a60";
var openWeatherApiKey = "9c26d768ead86b39036caf98fb0abbfa";

var placeId, lat, lon;
var today = dayjs();
var userInput = ""
var search = $('#searchBtn')
var datesArray = $('.dates')

// $('#current').append(today.format('dddd, MMMM D'));

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

//this function only currently works after the fetchLocation() function is run
//the url needs a latitude an longitude
function getGeoapifyLocationId(){
    
    fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${GeoapiKey}`)
    .then(response => response.json())
    .then(function(result){
        placeId = result.features[0].properties.place_id;

        //this is a placeholder value please work on it to change or update based off of 
        //if multiple categories store them as a string with commas inbetween the categories
        //example: accomidation,activity,commercial,education
        //full list of options here https://apidocs.geoapify.com/docs/places/#categories
        let category = "commercial";
        getPlaceDetails(category);
    })
    .catch(error => console.log('error', error));

}

//hopefully creates a card with data for the 
function createPlaceDetailCard(dataObject, category){
    //based off the web data fill out a card
    //creating the card
    let card = $(`<div class="card"></div>`);
    //sets the color based of the category
    switch (category){
        case "commercial":
            card.addClass("orange lighten-2");
            break;
        case "entertainment":
            card.addClass("green darken-2");       
            break;
        case "accomidation":
            card.addClass("amber lighten-1"); 
            break;
        default:
            card.addClass("blue darken-2");
    }
    //creates a card content section based of the materialize format
    //https://materializecss.com/cards.html
    let cardContent = $(`<div class="card-content white-text"></div>`);
    //capitalizes it for the card
    category = category.charAt(0).toUpperCase() + category.slice(1);
    cardContent.append(`<h4>${category}</h4>`);

    //card title with the name
    let cardTitle = $(`<span class="card-title">${dataObject.name}</span>`);
    

    cardContent.append(cardTitle);
    //card details with a description?

    //location
    if(dataObject.address !== undefined){
        cardContent.append($(`<p>Location: ${dataObject.address}</p>`));
    }

    //category type
    for(let x = 0; x < dataObject.categories.length; x++){
        //the way the categories are stored is alphabetically
        //if we find the category that matches up to the search the
        //next one will be a specific type
        //could be more consise but will work just fine
        /* Example
            categories:
                0: "building"
                1: "building.tourism"
                2: "entertainment"
                3: "entertainment.museum"
        */
        if(dataObject.categories[x] === category){
            //this gets the little bit for the specific type
            cardContent.append($(`<p>${category} type: ${dataObject.categories[x+1].split(".")[1]}</p>`));
        }
    }

    //hours of opperation
    if(dataObject.hours !== undefined){
        cardContent.append($(`<p>Hours open: ${dataObject.hours}</p>`))
    }

    //bottom of the card with links
    let cardLinks = $(`<div class="card-action"></div>`);
    if(dataObject.website !== undefined){
        let webLink = $(`<a class="blue-text" href="${dataObject.website}">${dataObject.name}</a>`)
        cardLinks.append(webLink);
    }
    if(dataObject.phone !== undefined){
        //this just replaces any paranthesis and dashes
        let phoneNumberFormatted = dataObject.phone.replace("(","").replace(")","").replace("-","");
        let phoneLink = $(`<a class="blue-text" href="tel:${phoneNumberFormatted}">${dataObject.phone}</a>`)
        cardLinks.append(phoneLink);
    }

    //appends to the bottom of the page
    //append the content to the card
    card.append(cardContent, cardLinks);
    //creates the overal container and adds the card to it
    let cardContainer = $(`<div class="col s12 m6"></div>`);
    cardContainer.append(card);
    //gets the card into the right place hopefully
    $("#tukwila > .row").append(cardContainer);
}

function processGeoapifyPlaceDetails(data, category){
    //features is an array with each element being an object having a type, a properties object, and a  geometry object
    //We want to get information from the properties object within each feature object from the list
    //ex: Features[0].properties.name will return the name of the first place that was returned from the search parameters
    let features = data.features;

    //example
    let exampObj = features[Math.floor(Math.random()*features.length)];
    //since the categories it returns are alphabetical I would like to use the one we put in
    let dataWeWantObj = {
        name: exampObj.properties.name,
        address: exampObj.properties.address_line2,
        phone: exampObj.properties.datasource.raw.phone,
        hours: exampObj.properties.datasource.raw.opening_hours,
        website: exampObj.properties.datasource.raw.website,
        categories: exampObj.properties.categories
    };

    createPlaceDetailCard(dataWeWantObj, category);

}

function getPlaceDetails(category){

    fetch(`${baseGeoPlacesUrl}categories=${category}&filter=place:${placeId}&apiKey=${GeoapiKey}`)
    .then(function(response){
        if(response.ok){
            return response.json()
        }
    })
    .then(function(data){
        console.log(data);
        processGeoapifyPlaceDetails(data, category);
    })

}


function fetchLocation(location){

    var geoReq = `https://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=${openWeatherApiKey}`;

    fetch(geoReq).then(function(response){
        if(response.ok){
            return response.json();
        }
    }).then(function(data){
        lat = data[0].lat;
        lon = data[0].lon;
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
        //just logs the data for now
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

