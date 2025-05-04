import { searchLocation } from "./location.mjs";
import { getWeather } from "./weather.mjs";

export function initUI() {
  const locationSearch = document.getElementById("location-search");
  const locationList = document.getElementById("location");

  /** @type {Record<string, import("./location.mjs").LocationResult>} */
  const locations = {};

  locationList.addEventListener("change", (event) => {
    const location = locations[event.target.value];
    if (!location) {
      console.error("Location not found:", event.target.value);
      return;
    }

    updateWeatherData(location);
  });

  locationSearch.addEventListener("change", async (event) => {
    const query = event.target.value;
    if (query.length < 3) {
      console.log("Query too short, ignoring.");
      return;
    }
    console.log("Location search changed:", query);

    searchLocation(query)
      .then((response) => {
        const locationResults = response.results;
        if (!locationResults || locationResults.length === 0) {
          console.log("No locations found for query:", query);
          return;
        }
        updateWeatherData(locationResults[0]);

        locationList.innerHTML = ""; // Clear previous results

        locationResults.forEach((location) => {
          const listItem = document.createElement("option");

          const locationKey = `${location.name}, ${location.admin1}, ${location.admin2}, ${location.country}`;
          locations[locationKey] = location;

          listItem.textContent = locationKey;
          locationList.appendChild(listItem);
        });
      })
      .catch((error) => {
        console.error("Error fetching location data:", error);
      });
  });
  const location = document.getElementById("location");
}

/**
 * Update the weather data based on the selected location.
 *
 * @param {import("./location.mjs").LocationResult} location
 */
function updateWeatherData(location) {
  console.log("Updating weather data for location:", location);
  getWeather(location.latitude, location.longitude)
    .then((weatherData) => {
      console.log("Weather data:", weatherData);
      const weatherDisplay = document.getElementById("weather-display");
      const temperature = weatherData.current.temperature_2m;
      const temperatureColor =
        temperature > 25 ? "red" : temperature < 10 ? "blue" : "black";

      weatherDisplay.innerHTML = `
      <h2>Weather in ${location.name}</h2>
      <p style="color: ${temperatureColor};">Temperature: ${temperature}°C</p>
      <p>Elevation: ${location.elevation} m</p>
      <p>Latitude: ${location.latitude}</p>
      <p>Longitude: ${location.longitude}</p>
    `;
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
}
