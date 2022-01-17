var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#location");
var dayDisplay = document.querySelector("#currentDay");
var todayEl = document.querySelector("#today");
var forecastEl = document.querySelector("#forecast");

dayDisplay.textContent = moment().format("MMM Do YY");

// ============GET THE COORDINATES FOR THE ENTERED CITY==============
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
// ==========================================================

// ============PASS THE COORDINATES FOR WEATHER==============
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
// ==========================================================

// ==========CREATE DIV ELEMENT PASSING CLASSES AND INNERHTML==========

var createDivEl = function (classes, inner) {
  var el = document.createElement("div");
  el.classList = classes;
  el.innerHTML = inner;
  return el;
};
// ==========================================================

// ============RETURN PROPER WEATHER ICON==============

var weatherIcon = function (id, nightDay) {
  // List which icons to use
  var icon;
  var thunderstorm = "<i class='bi bi-cloud-lightning-rain'></i>";
  var drizzle = "<i class='bi bi-cloud-drizzle'></i>";
  var rain = "<i class='bi bi-cloud-rain'></i>";
  var snow = "<i class='bi bi-snow'></i>";
  var haze = "<i class='bi bi-cloud-haze'></i>";
  if (nightDay === 0) {
    var clear = "<i class='bi bi-moon-stars'></i>";
  } else if (nightDay === 1) {
    var clear = "<i class='bi bi-brightness-high'></i>";
  }
  if (nightDay === 0) {
    var cloud = "<i class='bi bi-cloud-moon'></i>";
  } else if (nightDay === 1) {
    var cloud = "<i class='bi bi-cloud-sun'></i>";
  }
  var cloudy = "<i class='bi bi-cloud'></i>";

  //   Assign the icon depending on the weather id
  if (id >= 200 && id < 300) {
    icon = thunderstorm;
  } else if (id >= 300 && id < 400) {
    icon = drizzle;
  } else if ((id >= 500 && id <= 504) || (id >= 520 && id < 600)) {
    icon = rain;
  } else if (id === 511) {
    icon = snow;
  } else if (id >= 600 && id < 700) {
  } else if (id >= 700 && id < 800) {
    icon = haze;
  } else if (id === 800) {
    icon = clear;
  } else if (id === 801) {
    icon = cloud;
  } else if (id >= 802) {
    icon = cloudy;
  }
  return icon;
};
// ==========================================================
var nightOrDay = function (sunrise, sunset, current) {
  var nightDay;
  // If statement to see if it is night or day
  if (current * 1000 < sunrise * 1000 || current * 1000 > sunset * 1000) {
    nightDay = 0;
  } else {
    nightDay = 1;
  }
  return nightDay;
};
// =============DISPLAY WEATHER=============

var displayWeather = function (weather, location) {
  var current = weather.current;
  var hourly = weather.hourly;
  var sunrise = weather.current.sunrise;
  var sunset = weather.current.sunset;
  var nightDay = nightOrDay(sunrise, sunset, current.dt);

  // pass which icon to use
  var icon = weatherIcon(current.weather[0].id, nightDay);

  console.log(current);

  var city = createDivEl(
    "bg-white p-2 m-2 w-75 rounded fs-1",
    "<i class='bi bi-geo-alt'></i>" + location + "  " + icon
  );
  var temp = createDivEl(
    "bg-white p-2 m-2 rounded w-50 fs-1",
    "<i class='bi bi-thermometer-half'></i>" + Math.round(current.temp)
  );
  var details = createDivEl("d-flex flex-row justify-content-around", "");
  var wind = createDivEl(
    "bg-white p-2 m-2 rounded fs-3",
    "<i class='bi bi-wind'></i></br>" + current.wind_speed
  );

  var humidity = createDivEl(
    "bg-white p-2 rounded fs-3",
    "<i class='bi bi-moisture'></i></br>" + current.humidity
  );

  var uv = createDivEl(
    "bg-white p-2 m-2 rounded fs-3",
    "<i class='bi bi-rainbow'></i></br>" + current.uvi
  );

  var hourlyContainer = createDivEl(
    "d-flex flex-row justify-content-around",
    ""
  );

  for (var i = 1; i < 9; i++) {
    console.log(hourly[i].weather[0].id);
    var forecastHour = createDivEl("bg-white p-2 m-2 rounded");

    var timeStamp = new Date(hourly[i].dt * 1000);
    var hour = timeStamp.getHours();

    nightDay = nightOrDay(sunrise, sunset, hourly[i].dt);
    icon = weatherIcon(hourly[i].weather[0].id, nightDay);
    console.log(icon);

    var hourlyTemp = Math.round(hourly[i].temp);

    if (hour <= 12) {
      var displayTime = hour + "AM";
    } else if (hour > 12) {
      var displayTime = hour - 12 + "PM";
    }

    forecastHour.innerHTML =
      displayTime +
      icon +
      "</br>" +
      "<i class='bi bi-thermometer-half'></i>" +
      hourlyTemp;

    hourlyContainer.appendChild(forecastHour);
  }

  details.appendChild(wind);
  details.appendChild(humidity);
  details.appendChild(uv);

  todayEl.appendChild(city);
  todayEl.appendChild(temp);
  todayEl.appendChild(details);
  todayEl.appendChild(hourlyContainer);

  displayForecast(weather);
};

// ==========================================================

// ===========DISPLAY 5 DAY FORECAST================

var displayForecast = function (weather) {
    var daily = weather.daily
  var dailyContainer = createDivEl("d-flex flex-row justify-content-around", "");

  for (var i = 1; i < 6; i++) {
    var forecastDay = createDivEl("bg-white rounded p-3 m-2");

    var dayStamp = new Date(daily[i].dt * 1000);
    var day = dayStamp.getDate();

    var dailyTemp =
      Math.round(daily[i].temp.min) +
      " - " +
      Math.round(daily[i].temp.max);
    var dailyHumidity = daily[i].humidity;

    forecastDay.innerHTML =
      day +
      "</br><i class='bi bi-thermometer-half'></i>" +
      dailyTemp +
      "</br><i class='bi bi-moisture'></i> " +
      dailyHumidity;

    dailyContainer.appendChild(forecastDay);
  }

  forecastEl.appendChild(dailyContainer);
};

// ==========================================================

// ===========PASS CITY IN SUBMIT BOX===============

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
// ==========================================================

// ============SAVE CITY INFO===============

// ==========================================================

cityFormEl.addEventListener("submit", formSubmitHandler);
// getCoordinates("atlanta");
