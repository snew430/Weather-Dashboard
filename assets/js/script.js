var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#location");
var dayDisplay = document.querySelector("#currentDay");
var todayEl = document.querySelector("#today");
var forecastEl = document.querySelector("#forecast");

dayDisplay.textContent = moment().format("MMM Do YY");

var getCoordinates = function (location) {
  var coordUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    location +
    "&units=imperial&appid=8a42d43f7d7dc180da5b1e51890e67dc";

  fetch(coordUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        searchWeather(data.coord.lon, data.coord.lat, data.name);
      });
    } else {
      alert("Sorry, I did not recognize that city.");
    }
  });
};

var searchWeather = function (long, lat, city) {
  apiUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    long +
    "&units=imperial&appid=8a42d43f7d7dc180da5b1e51890e67dc";

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        displayWeather(data, city);
      });
    } else {
      alert("Sorry, I did find the coordinates.");
    }
  });
};

var createDivEl = function (classes, inner) {
  var el = document.createElement("div");
  el.classList = classes;
  el.innerHTML = inner;
  return el;
};

var displayWeather = function (weather, location) {

    console.log(weather.current.weather)

    if(weather.current)

  var city = createDivEl(
    "bg-white p-2 m-2 w-75 rounded fs-1",
    "<i class='bi bi-geo-alt'></i>" + location
  );
  var temp = createDivEl(
    "bg-white p-2 m-2 rounded w-50 fs-1",
    "<i class='bi bi-thermometer-half'></i>" + weather.current.temp
  );
  var details = createDivEl("d-flex flex-row justify-content-around", "");
  var wind = createDivEl(
    "bg-white p-2 m-2 rounded fs-3",
    "<i class='bi bi-wind'></i></br>" + weather.current.wind_speed
  );

  var humidity = createDivEl(
    "bg-white p-2 rounded fs-3",
    "<i class='bi bi-moisture'></i></br>" + weather.current.humidity
  );

  var uv = createDivEl(
    "bg-white p-2 m-2 rounded fs-3",
    "<i class='bi bi-rainbow'></i></br>" + weather.current.uvi
  );

  var hourly = createDivEl("d-flex flex-row justify-content-around", "")

  for (var i = 1; i < 11; i++) {
    var forecastHour = createDivEl("bg-white p-2 m-2 rounded");

    var timeStamp = new Date(weather.hourly[i].dt * 1000);
    var hour = timeStamp.getHours();

    if (hour <= 12) {
      var displayTime = hour + " AM";
    } else if (hour > 12) {
      var displayTime = hour - 12 + " PM";
    }

    forecastHour.textContent = displayTime;

    hourly.appendChild(forecastHour);
  }

  details.appendChild(wind);
  details.appendChild(humidity);
  details.appendChild(uv);

  todayEl.appendChild(city);
  todayEl.appendChild(temp);
  todayEl.appendChild(details);
  todayEl.appendChild(hourly);

  displayForecast(weather);
};

var displayForecast = function (weather) {
  var daily = createDivEl("d-flex flex-row justify-content-around","")

  for (var i = 1; i < 6; i++) {
      console.log(weather.daily[i])
    var forecastDay = createDivEl("bg-white rounded p-3 m-2")

    var dayStamp = new Date(weather.daily[i].dt * 1000);
    var day = dayStamp.getDate();

    var dailyTemp = Math.round(weather.daily[i].temp.min) + " - "+ Math.round(weather.daily[i].temp.max)

    forecastDay.innerHTML = day + "</br><i class='bi bi-thermometer-half'></i>"+  dailyTemp;

    daily.appendChild(forecastDay);
  }

  forecastEl.appendChild(daily);
};

var formSubmitHandler = function (event) {
  event.preventDefault();

  // get value from input element
  var city = cityInputEl.value.trim();
  todayEl.textContent = "";
  forecastEl.textContent = "";
  if (city) {
    getCoordinates(city);
    cityInputEl.value = "";
  } else {
    alert("Please Enter a City");
  }
};

// cityFormEl.addEventListener("submit", formSubmitHandler);
getCoordinates("atlanta");
