document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "HoUiJO4kwLtOTJGtwYZglDdn8dpkN3j4";
    const form = document.getElementById("cityForm");
    const weatherDiv = document.getElementById("weather");
    const forecastDiv = document.getElementById("forecast");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
    });

    function getWeather(city) {
        const url = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchWeatherData(locationKey);
                    fetchDailyForecast(locationKey);
                    fetchHourlyForecast(locationKey);
                } else {
                    weatherDiv.innerHTML = `<p>City not found.</p>`;
                    forecastDiv.innerHTML = '';
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                weatherDiv.innerHTML = `<p>Error fetching location data.</p>`;
                forecastDiv.innerHTML = '';
            });
    }

    function fetchWeatherData(locationKey) {
        const url = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayWeather(data[0]);
                } else {
                    weatherDiv.innerHTML = `<p>No weather data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                weatherDiv.innerHTML = `<p>Error fetching weather data.</p>`;
            });
    }

    function displayWeather(data) {
        const temperature = data.Temperature.Metric.Value;
        const weather = data.WeatherText;
        const weatherContent = `
            <h2>Current Weather</h2>
            <p>Temperature: ${temperature}°C</p>
            <p>Weather: ${weather}</p>
        `;
        weatherDiv.innerHTML = weatherContent;


        displayWeatherIcon(weather);
    }

    function displayWeatherIcon(weather) {
        let iconSrc = "";
        switch (weather.toLowerCase()) {
            case "sunny":
                iconSrc = "images/sunny.png";
                break;
            case "cloudy":
                iconSrc = "images/cloudy.png";
                break;
            case "rain":
                iconSrc = "images/rain.png";
                break;

            default:
                iconSrc = "images/unknown.png";
                break;
        }
        const iconElement = document.querySelector(".weather-icon");
        if (iconElement) {
            iconElement.src = iconSrc;
        }
    }

    function fetchDailyForecast(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}&metric=true`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.DailyForecasts ) {
                    displayDailyForecast(data.DailyForecasts);
                } else {
                    forecastDiv.innerHTML = `<p>No daily forecast available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching daily forecast data:", error);
                forecastDiv.innerHTML = `<p>Error fetching daily forecast data.</p>`;
            });
    }

    function displayDailyForecast(forecasts) {
          let forecastContent = `<h2>5-Day Forecast</h2>`;
          forecasts.forEach(forecast => {
              forecastContent += `
                  <div>
                      <p>Date: ${new Date(forecast.Date).toLocaleDateString()}</p>
                      <p>Day: ${forecast.Day.IconPhrase}, ${forecast.Temperature.Maximum.Value}°C</p>
                      <p>Night: ${forecast.Night.IconPhrase}, ${forecast.Temperature.Minimum.Value}°C</p>
                  </div>
              `;
          });
          weatherDiv.innerHTML += forecastContent;
      }

    function fetchHourlyForecast(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/${locationKey}?apikey=${apiKey}&metric=true`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayHourlyForecast(data);
                } else {

                    console.log("No hourly forecast available.");
                    forecastDiv.innerHTML += '<p>No hourly forecast available.</p>';
                }
            })
            .catch(error => {
                console.error("Error fetching hourly forecast data:", error);
                forecastDiv.innerHTML += '<p>Error fetching hourly forecast data.</p>';
            });
    }

    function displayHourlyForecast(hourlyData) {

        let hourlyForecastContent = '<h2>Hourly Forecast</h2>';
        hourlyData.forEach(hour => {
            const time = new Date(hour.DateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const temperature = hour.Temperature.Value;
            const weather = hour.IconPhrase;
            hourlyForecastContent += `
                <p>${time}: ${temperature}°C, ${weather}</p>
            `;
        });
        forecastDiv.innerHTML += hourlyForecastContent;
    }
});
