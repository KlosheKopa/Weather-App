const searchForm = document.querySelector('#searchForm');
const searchBtn = document.querySelector('#submit');
const apiKey = '343b67307d19ab09d73a6aac99f7f908';
const apiWeather = 'https://api.openweathermap.org/data/2.5/weather';
const apiForecast = 'https://api.openweathermap.org/data/2.5/forecast';
const weather = document.querySelector('#weather');
const forecast = document.querySelector('#forecast');
const searchHistoryList = document.querySelector('#previousSearches');

function getWeather(city){
    fetch(`${apiWeather}?q=${city}&appid=${apiKey}&units=imperial&cnt=5`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const parsedData = JSON.parse(JSON.stringify(data));
      const weatherItem = document.createElement('div');
      const weatherIcon = parsedData.weather[0].icon;

      const temperature = parsedData.main.temp;
      const wind = parsedData.wind.speed;
      const humidity = parsedData.main.humidity;
      const date = new Date(parsedData.dt * 1000).toLocaleDateString();
      const cityName = parsedData.name;

      

      weatherItem.innerHTML = `
          <h3>${cityName}</h3>
          <div>
            <p>Date: ${date}</p>
            <p>Temperature: ${temperature}F</p>
            <p>Wind speed: ${wind} m/s</p>
            <p>Humidity: ${humidity}%</p>
            <img src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="Weather Icon">
          </div>
        `;

      weather.innerHTML = '';
      weather.appendChild(weatherItem);

      // Add city to history list and create button
      listCityHistory(cityName);
    })
    .catch(error => {
      console.error(`Error: ${error}`);
    });
}


searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const cityName = event.target.elements.city.value;
    getWeather(cityName);
    getForecast(cityName);
    event.target.elements.city.value = '';
});

function listCityHistory(city) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory'));

    function checkHistory(arr, val){
        return arr.some((arrVal) => val === arrVal);
    }


    if (!checkHistory(searchHistory, city)) {
        searchHistory.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
    
    searchHistoryList.innerHTML = '';

    for (let i = 0; i < searchHistory.length; i++) {
        const cityButton = document.createElement('button');
        cityButton.textContent = searchHistory[i];
        cityButton.classList.add('btn');
        cityButton.addEventListener('click', function () {
        getWeather(searchHistory[i]);
        getForecast(searchHistory[i]);
        });

        searchHistoryList.appendChild(cityButton);
    }
}

function getForecast(city) {
    fetch(`${apiForecast}?q=${city}&appid=${apiKey}&units=imperial&cnt=6`)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        const parsedData = JSON.parse(JSON.stringify(data));
  
        const forecastList = document.createElement('div');
        forecastList.classList.add('row');
  
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 1);
  
        parsedData.list.slice(1).forEach(function (forecast, index) {
          const forecastItem = document.createElement('div');
          forecastItem.classList.add('col');
          forecastItem.classList.add('border');
          forecastItem.classList.add('rounded');
  
          const weatherIcon = forecast.weather[0].icon;
          const temperature = forecast.main.temp;
          const wind = forecast.wind.speed;
          const humidity = forecast.main.humidity;
          const date = new Date(currentDate.getTime() + index * 24 * 60 * 60 * 1000).toLocaleDateString();
  
          forecastItem.innerHTML = `
          <div\> 
          <p>Date: ${date}</p>
          <p>Temperature: ${temperature}F</p>
          <p>Wind speed: ${wind} m/s</p>
          <p>Humidity: ${humidity}%</p>
          <img src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="Weather Icon">
          </div>
          `;
  
          forecastList.appendChild(forecastItem);
        });
  
        forecast.innerHTML = '';
        forecast.appendChild(forecastList);
      })
      .catch(error => {
        console.error(`Error: ${error}`);
      });
}

window.onload = function () {
    getWeather('Eugene');
    getForecast('Eugene');
}