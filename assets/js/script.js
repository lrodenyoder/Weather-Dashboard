

// VARIABLES
var cityHistoryArray = [];
var cityHistoryCounter = 0;
//containers
var cityFormEl = document.getElementById("city-form");
var cityNameInputEl = document.getElementById("city");
var currentWeatherEl = document.getElementById("current-weather-list-container");
var weatherIcon = document.getElementById("today-weather");
var displayCurrentCity = document.getElementById("current-city");
var iconEl = document.getElementById("icon");
var forecastWrapperEl = document.getElementById("five-day-card-wrapper");
var historyContainerEl = document.getElementById("history-container");
//display dates
var currentDate = moment().format("L");
var displayCurrentDate = document.getElementById("current-date");


//FUNCTIONS
var getCityCoord = function (city) {
    //current weather with forecast requires to search by coordinates. this fetches coordinates from openweather to pass back to openweather to get current/future weather info
    var coordApiUrl =
        "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=bbd00506b478ea434ee9078c12cf9bc9";
    
    fetch(coordApiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json()
                    .then(function (data) {
                         cityHistoryArray.unshift(city);
                        // console.log(data);
                        // localTimeZone = data.timezone;
                        // console.log(localTimeZone / 60);
                        // historyContainerEl.textContent = "";
                        // cityNameInputEl.value = "";
                         displayCurrentCity.textContent = city;
                        // displayCurrentDate.textContent =
                        //   "(" + currentDate + ")";
                        // saveCityHistory();
                        //get city latitude and longitude
                        var cityLat = data.coord.lat;
                        var cityLon = data.coord.lon;
                    
                        getWeatherData(cityLat, cityLon);
                        // return true;
                });
            } else {
                displayCurrentCity.textContent = "";
                displayCurrentDate.textContent = "";
                cityNameInputEl.value = "";
                alert("Error: City Not Found");
                return;
            }
        })
        .catch(function (error) {
            alert("Unable to Connect to OpenWeather")
        });
};

//push lat and lon back to openweather to fetch weather data
var getWeatherData = function (cityLat, cityLon) {
    var weatherApiUrl =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&units=imperial&appid=bbd00506b478ea434ee9078c12cf9bc9";
    
    fetch(weatherApiUrl)
      .then(function (response) {
        if (response.ok) {
            response.json()
                .then(function (data) {
                //cityHistoryArray.unshift(city);
                //console.log(data);
                localTimeZone = data.timezone;
                //console.log(data.timezone);
                currentDate = moment.utc().tz(localTimeZone).format("L");
                //console.log(currentDate);
                historyContainerEl.textContent = "";
                cityNameInputEl.value = "";
                // displayCurrentCity.textContent = city;
                displayCurrentDate.textContent = "(" + currentDate + ")";
                saveCityHistory();



                    displayWeather(data);
                    displayForecast(data);
                });
        } else {
          alert("Error: City Not Found");
        }
      })
      .catch(function (error) {
        alert("Unable to Connect to OpenWeather");
      });
};

var displayWeather = function (weather) {
    if (currentWeatherEl.textContent == "") {
        //set weather icon
        var iconImg = weather.current.weather[0].icon;
        icon.setAttribute(
            "src",
            "http://openweathermap.org/img/wn/" + iconImg + ".png"
        );

        weatherIcon.appendChild(icon);

        //create ul container
        var weatherList = document.createElement("ul");
        weatherList.classList = "curr-weather-list list-unstyled";
        weatherList.id = "curr-weather-list";

        //set current temp
        var tempLi = document.createElement("li");
        tempLi.classList = "curr-weather-list-item";
        tempLi.id = "curr-temp";
        tempLi.textContent = "Temperature: " + weather.current.temp + "°F";

        weatherList.appendChild(tempLi);

        //set current wind speed
        var windSpeedLi = document.createElement("li");
        windSpeedLi.classList = "curr-weather-list-item";
        windSpeedLi.id = "curr-wind";
        windSpeedLi.textContent = "Wind Speed: " + weather.current.wind_speed + " MPH";

        weatherList.appendChild(windSpeedLi);

        //set current humidity
        var humidLi = document.createElement("li");
        humidLi.classList = "curr-weather-list-item";
        humidLi.id = "curr-humid";
        humidLi.textContent = "Humidity: " + weather.current.humidity + "%";

        weatherList.appendChild(humidLi);

        //set current uvi
        var uviLi = document.createElement("li");
        uviLi.id = "curr-uvi";
        uviLi.innerHTML = "UV Index:  <span id='uvi-color'></span>";
   
        weatherList.appendChild(uviLi);

        //append ul to html container
        currentWeatherEl.appendChild(weatherList);

        //add uvi text and class after appending list to allow for variable bg color
        var uviText = weather.current.uvi;
        var uviLiSpan = document.getElementById("uvi-color");
        uviLiSpan.textContent = uviText;

        //change uvi bg color based on uv index value
        if (uviText >= 8 && uviText <= 10) {
            uviLiSpan.classList = "curr-weather-list-item text-white bg-danger";
        } else if (uviText >= 6 && uviText <= 7.99) {
            uviLiSpan.classList = "curr-weather-list-item text-white bg-warning";
        } else if (uviText >= 3 && uviText <= 5.99) {
            uviLiSpan.classList = "curr-weather-list-item";
            uviLiSpan.setAttribute("style", "background-color: yellow");
        } else if (uviText >= 0 && uviText <= 2.99) {
            uviLiSpan.classList = "curr-weather-list-item text-white bg-success";
        } else {
            uviLiSpan.textContent = "Error: Value Out Of Bounds"
        }
    } else {
        return;
    }
};

var displayForecast = function (weather) {
    if (forecastWrapperEl.textContent == "") {
        //loop through next 5 days to create forecast cards
        for (var i = 0; i < 5; i++) {
            // create card
            var displayForecastCard = document.createElement("div");
            displayForecastCard.id = "day-" + i + "-card";
            displayForecastCard.classList =
                "text-center col-sm col-md col-lg five-day-card";

            //create h3 with date
            var displayForecastDateEl = document.createElement("h3");
            displayForecastDateEl.id = "card-" + i;
            displayForecastDateEl.textContent = moment()
              .utc()
              .tz(localTimeZone)
              .add(i + 1, "day")
              .format("L");

            //create list of weather info
            var displayForecastList = document.createElement("ul");
            displayForecastList.classList = "future-weather-list list-unstyled";

            //create icon list item
            var displayForecastIcon = document.createElement("li");
            var imgEl = document.createElement("img");
            var iconImg = weather.daily[i].weather[0].icon;
            imgEl.setAttribute(
                "src",
                "http://openweathermap.org/img/wn/" + iconImg + ".png"
            );
            displayForecastIcon.appendChild(imgEl);
            displayForecastList.appendChild(displayForecastIcon);

            //create temp list item
            var displayForecastTemp = document.createElement("li");
            displayForecastTemp.classList = "forecast-list-item";
            displayForecastTemp.textContent =
                "Temp: " + weather.daily[i].temp.day + "°F";
            displayForecastList.appendChild(displayForecastTemp);

            //create wind speed list item
            var displayForecastWind = document.createElement("li");
            displayForecastWind.classList = "forecast-list-item";
            displayForecastWind.textContent =
                "Wind: " + weather.daily[i].wind_speed + " MPH";
            displayForecastList.appendChild(displayForecastWind);

            //create humidity list item
            var displayForecastHumid = document.createElement("li");
            displayForecastHumid.classList = "forecast-list-item";
            displayForecastHumid.textContent =
                "Humidity: " + weather.daily[i].humidity + "%";
            displayForecastList.appendChild(displayForecastHumid);

            displayForecastCard.appendChild(displayForecastDateEl);
            displayForecastCard.appendChild(displayForecastList);
            forecastWrapperEl.appendChild(displayForecastCard);
        }
    } else {
        return;
    }
};

var saveCityHistory = function () {
  
    localStorage.setItem("cityHistory", JSON.stringify(cityHistoryArray));
    createHistoryList(cityHistoryArray);
};

var loadCityHistory = function () {
    var cityHistory = JSON.parse(localStorage.getItem("cityHistory"));
    
    //checks if localStorage is empty
    if (cityHistory) {
        cityHistoryArray = cityHistory;
        createHistoryList(cityHistory);
    } else {
        return;
    }
};

var createHistoryList = function (cityHistory) {
    //trims array to 6 most recent cities
    var sixCities = cityHistory.slice(0, 6);
    
    var historyCityDiv = document.createElement("div");
    historyCityDiv.classList = "row";
    
    //loops through array to create history buttons
    for (var i = 0; i < sixCities.length; i++) {
      var historyCity = document.createElement("button");
        historyCity.classList = "city-btn col-4 col-md-4 col-lg-12";
        historyCity.id = "city-btn";
        historyCity.setAttribute("data-city-id", i);
        
        historyCity.textContent = (sixCities[i]);
      
        historyCityDiv.appendChild(historyCity);
        
    }
    historyContainerEl.appendChild(historyCityDiv);
};

var formSubmitHandler = function (event) {
    event.preventDefault();
    //remove old content
    currentWeatherEl.textContent = "";
    forecastWrapperEl.textContent = "";
    iconEl.removeAttribute("src");

    //get city name from user input
    var city = cityNameInputEl.value.trim().toUpperCase();
    
    getCityCoord(city);
};

//EVENT LISTENERS
cityFormEl.addEventListener("submit", formSubmitHandler);
document.addEventListener("click", function (event) {
    if (event.target && event.target.id == "city-btn") {
        var city = event.target.textContent;
        getCityCoord(city);
        currentWeatherEl.textContent = "";
        forecastWrapperEl.textContent = "";
        historyContainerEl.textContent = "";
        iconEl.removeAttribute("src");
        cityHistoryArray.unshift(city);

        if (city) {
          cityNameInputEl.value = "";
          displayCurrentCity.textContent = city;
          displayCurrentDate.textContent = "(" + currentDate + ")";
          getCityCoord(city);
          saveCityHistory();
        } else {
          alert("Please enter a valid city");
        }
    } else {
        return;
    }
});

loadCityHistory();

//TO DO: GET LOCAL TIME FROM LOCAL TIME ZONES. EG: TOKYO IS 9 HOURS AHEAD, DATES CAN BE DIFFERENT
