/**
 * @typedef {Object} WeatherData
 * @property {number} latitude - The latitude of the location.
 * @property {number} longitude - The longitude of the location.
 * @property {number} elevation - The elevation of the location.
 * @property {CurrentWeather} current - The current weather data.
 * @property {WeatherSeries} hourly - The hourly weather data series.
 */

/**
 * @typedef {Object} CurrentWeather
 * @property {string} time - The time of the current weather data.
 * @property {number} interval - The interval in seconds.
 * @property {number} temperature_2m - The temperature at 2 meters above ground level.
 */

/**
 * @typedef {Object} WeatherSeries
 * @property {string[]} time - Array of time points for the weather series.
 * @property {number[]} temperature_2m - Array of temperatures at 2 meters above ground level.
 */

/**
 * Get the weather data for a location via the Open-Meteo API.
 *
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<WeatherData>}
 */
export async function getWeather(latitude, longitude) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.append("latitude", latitude.toFixed(3));
  url.searchParams.append("longitude", longitude.toFixed(3));
  url.searchParams.append("current", "temperature_2m");
  url.searchParams.append("hourly", "temperature_2m");

  const result = await fetch(url);
  if (!result.ok) {
    throw new Error(
      "Weather error: " + result.status + " " + result.statusText
    );
  }
  /** @type {WeatherData} */
  const body = await result.json();
  return body;
}
