//call city by name http://api.openweathermap.org/data/2.5/weather?q=[city name]&appid=bbd00506b478ea434ee9078c12cf9bc9
//call city by lat/lon https://api.openweathermap.org/data/2.5/onecall?lat=[lat]&lon=[lon]&appid=bbd00506b478ea434ee9078c12cf9bc9
//get weather icons  http://openweathermap.org/img/wn/[icon]['optional sizing'@2x].png


// VARIABLES
var cityFormEl = document.getElementById("city-form");
var cityNameInputEl = document.getElementById("city");
var currentWeatherEl = document.getElementById("current-weather-list-container");
var weatherIcon = document.getElementById("today-weather");

//display dates
var currentDate = moment().format("L");
var displayCurrentDate = document.getElementById("current-date");
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
        "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&units=imperial&appid=bbd00506b478ea434ee9078c12cf9bc9";
    
    fetch(weatherApiUrl)
      .then(function (response) {
        if (response.ok) {
            response.json()
                .then(function (data) {
                    displayWeather(data);
                    //displayForecastWeather(data); ??
                });
          console.log(response);
        } else {
          alert("Error: City Not Found");
        }
      })
      .catch(function (error) {
        alert("Unable to Connect to OpenWeather");
      });
};

var displayWeather = function (weather, searchTerm) {
  //clear old data
  currentWeatherEl.textContent = "";

  //set weather icon
  var iconImg = weather.current.weather[0].icon;
  var icon = document.createElement("img");
  icon.setAttribute(
    "src",
    "http://openweathermap.org/img/wn/" + iconImg + ".png"
  );

  weatherIcon.appendChild(icon);

    //create ul container
  var weatherList = document.createElement("ul");
  weatherList.classList = "curr-weather-list list-unstyled";
    weatherList.id = "curr-weather-list";
    
    console.log(weatherList);

  console.log(weather);
  console.log(weather.current.temp);
  console.log(weather.current.wind_speed);
  console.log(weather.current.humidity);
    console.log(weather.current.uvi);
    
  //set current temp
  var tempLi = document.createElement("li");
  tempLi.classList = "curr-weather-list-item";
  tempLi.id = "curr-temp";
    tempLi.textContent = "Temperature: " + weather.current.temp + "°F";
    
    

    //append to ul
    weatherList.appendChild(tempLi);
    
  //set current wind speed
  var windSpeedLi = document.createElement("li");
  windSpeedLi.classList = "curr-weather-list-item";
  windSpeedLi.id = "curr-wind";
  windSpeedLi.textContent = "Wind Speed: " + weather.current.wind_speed + " MPH";

    //append to ul
    weatherList.appendChild(windSpeedLi);
    
  //set current humidity
  var humidLi = document.createElement("li");
  humidLi.classList = "curr-weather-list-item";
  humidLi.id = "curr-humid";
  humidLi.textContent = "Humidity: " + weather.current.humidity + "%";

    //append to ul
    weatherList.appendChild(humidLi);
    
  //set current uvi
  var uviLi = document.createElement("li");
  uviLi.classList = "curr-weather-list-item";
  uviLi.id = "curr-uvi";
  uviLi.textContent = "UV Index: " + weather.current.uvi;

    //append to ul
  weatherList.appendChild(uviLi);

    //append ul to html container
  currentWeatherEl.appendChild(weatherList);
};

var formSubmitHandler = function (event) {
    event.preventDefault();
    //get city name from user input
    var city = cityNameInputEl.value.trim().toUpperCase();
   
    var displayCurrentCity = document.getElementById("current-city");
    displayCurrentCity.textContent = city;
    displayCurrentDate.textContent = "(" + currentDate + ")";


    if (city) {
        getCityCoord(city);
        cityNameInputEl.value = "";
        //FUNCTION TO ADD TO HISTORY CALLS HERE
    } else {
        alert("Please enter a valid city")
    }
};

//EVENT LISTENERS
cityFormEl.addEventListener("submit", formSubmitHandler);