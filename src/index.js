import { fromUnixTime } from 'date-fns';
import { format } from 'date-fns';
import { addSeconds } from 'date-fns';
import './style.css';

const weather = (() => {
  const apiKey = '15d619a4a0b86fef116f10d59c976b06';
  let city;
  let country;

  function getCoordinates(city) {
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        weather.city = data[0].name;
        weather.country = data[0].country;
        return getWeather(data);
      });
  }

  function getWeather(coordinates) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates[0].lat}&lon=${coordinates[0].lon}&appid=${apiKey}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => processData(data))
      .then((data) => display.displayData(data));
  }

  function processData(data) {
    const processedData = {
      mainTemp: data.main.temp,
      feelsLike: data.main.feels_like,
      icon: data.weather[0].icon,
      description: data.weather[0].description,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      timezone: data.timezone,
      lowTemp: data.main.temp_min,
      highTemp: data.main.temp_max,
      pressure: data.main.pressure,
      humidity: data.main.humidity,
      visibility: data.visibility,
      cloudiness: data.clouds.all,
      windSpeed: data.wind.speed,
      windDirection: data.wind.deg,
    };

    return processedData;
  }

  return { city, country, getCoordinates };
})();

const display = (() => {
  function displayData(weatherData) {
    const mainTemp = document.getElementById('mainTemp');
    const feelsLike = document.getElementById('feelsLike');
    const location = document.getElementById('location');
    const weatherIcon = document.getElementById('weatherIcon');
    const description = document.getElementById('description');
    const sunrise = document.getElementById('sunrise');
    const sunset = document.getElementById('sunset');
    const lowTemp = document.getElementById('lowTemp');
    const highTemp = document.getElementById('highTemp');
    const pressure = document.getElementById('pressure');
    const humidity = document.getElementById('humidity');
    const visibility = document.getElementById('visibility');
    const cloudiness = document.getElementById('cloudiness');
    const windSpeed = document.getElementById('windSpeed');
    const windDirection = document.getElementById('windDirection');

    mainTemp.innerText = formatTemp(weatherData.mainTemp);
    feelsLike.innerText = formatTemp(weatherData.feelsLike);
    location.innerText = `${weather.city}, ${weather.country}`;
    weatherIcon.src = `http://openweathermap.org/img/wn/${weatherData.icon}@4x.png`;
    description.innerText = weatherData.description;
    sunrise.innerText = formatTime(weatherData.sunrise, weatherData.timezone);
    sunset.innerText = formatTime(weatherData.sunset, weatherData.timezone);
    lowTemp.innerText = `${formatTemp(weatherData.lowTemp)}°C`;
    highTemp.innerText = `${formatTemp(weatherData.highTemp)}°C`;
    pressure.innerText = `${weatherData.pressure} hPa`;
    humidity.innerText = `${weatherData.humidity}%`;
    visibility.innerText = `${weatherData.visibility / 1000} km`;
    cloudiness.innerText = `${weatherData.cloudiness}%`;
    windSpeed.innerText = `${weatherData.windSpeed} m/s`;
    windDirection.innerText = formatWindDirection(weatherData.windDirection);
  }

  return { displayData };
})();

function formatTemp(temp) {
  //Convert Kelvin Temp data from Openweather to Celcius
  return Math.round(temp - 273.15);
}

function formatTime(time, timezone) {
  //Get Offset in Seconds between Local time and UTC
  let timeLocal = new Date();
  let offsetUTC = timeLocal.getTimezoneOffset() * 60;

  //Convert unix time data to date object
  let timeData = fromUnixTime(time);

  //Convert time data to UTC then to actual timezone of weather data
  let timeUTC = addSeconds(timeData, offsetUTC);
  let timeConverted = addSeconds(timeUTC, timezone);

  return format(timeConverted, 'HH:mm');
}

function formatWindDirection(deg) {
  //Converts direction in degrees to compass directions
  return (deg >= 0 && deg <= 22.5) || (deg >= 337.5 && deg <= 360)
    ? 'North'
    : deg > 22.5 && deg < 67.5
    ? 'Northeast'
    : deg >= 67.5 && deg <= 112.5
    ? 'East'
    : deg > 112.5 && deg < 157.5
    ? 'Southeast'
    : deg >= 157.5 && deg <= 202.5
    ? 'South'
    : deg > 202.5 && deg < 247.5
    ? 'Southwest'
    : deg >= 247.5 && deg <= 292.5
    ? 'West'
    : 'Northwest';
}

weather.getCoordinates('manila');
