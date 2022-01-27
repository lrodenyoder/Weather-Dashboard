//call city by name http://api.openweathermap.org/data/2.5/weather?q=[city name]&appid=bbd00506b478ea434ee9078c12cf9bc9
//call city by lat/lon https://api.openweathermap.org/data/2.5/onecall?lat=[lat]&lon=[lon]&appid=bbd00506b478ea434ee9078c12cf9bc9


// VARIABLES
var cityFormEl = document.getElementById("city-form");
var cityNameInputEl = document.getElementById("city");
//display dates
var currentDate = moment().format("L");
var displayCurrentDate = document.getElementById("current-date");
displayCurrentDate.textContent = currentDate;
var displayNextDay1 = document.getElementById("card-0");
displayNextDay1.textContent = moment().add(1, "day").format("L");
var displayNextDay2 = document.getElementById("card-1");
displayNextDay2.textContent = moment().add(2, "days").format("L");
var displayNextDay3 = document.getElementById("card-2");
displayNextDay3.textContent = moment().add(3, "days").format("L");
var displayNextDay4 = document.getElementById("card-3");
displayNextDay4.textContent = moment().add(4, "days").format("L");
var displayNextDay5 = document.getElementById("card-4");
displayNextDay5.textContent = moment().add(5, "days").format("L");





//FUNCTIONS
var getCityCoord = function (city) {
    //current weather and forecast requires to search by coordinates. this fetches coordinates from openweather to pass back to openweather to get current/future weather info
    var coordApiUrl =
        "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=bbd00506b478ea434ee9078c12cf9bc9";
    
    fetch(coordApiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json()
                    .then(function (data) {
                    //get city latitude and longitude
                    var cityLat = data.coord.lat;
                    var cityLon = data.coord.lon;
                    
                    getWeatherData(cityLat, cityLon);
                });
                console.log(response); 
            } else {
                alert("Error: City Not Found");
            }
        })
        .catch(function (error) {
            alert("Unable to Connect to OpenWeather")
        });
};

//push lat and lon back to openweather to fetch weather data
var getWeatherData = function (cityLat, cityLon) {
    console.log(cityLat);
    console.log(cityLon);
    
    var weatherApiUrl =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&appid=bbd00506b478ea434ee9078c12cf9bc9";
    
    fetch(weatherApiUrl)
      .then(function (response) {
        if (response.ok) {
          response.json();
          console.log(response);
        } else {
          alert("Error: City Not Found");
        }
      })
      .catch(function (error) {
        alert("Unable to Connect to OpenWeather");
      });
};

var formSubmitHandler = function (event) {
    event.preventDefault();
    var city = cityNameInputEl.value.trim();
    console.log(city);

    if (city) {
        getCityCoord(city);
        cityNameInputEl.value = "";
    } else {
        alert("Please enter a valid city")
    }
};


    
 
//EVENT LISTENERS
cityFormEl.addEventListener("submit", formSubmitHandler);