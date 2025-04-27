/**
 * This script queries the current weather via an API
 * and saves the result to a file.
 */

import assert from "node:assert";
import { writeFile } from "node:fs/promises";

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
async function getWeather(latitude, longitude) {
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

/**
 * Write weather series data to a CSV file.
 *
 * @param {string} file Path to the CSV file to write.
 * @param {WeatherSeries} data Weather series data.
 */
async function writeHistoryCSV(file, data) {
  assert.call(
    data.time.length === data.temperature_2m.length,
    "Time and temperature data need to have the same length"
  );

  let content = '"time","temperature"\n';
  for (let i = 0; i < data.time.length; ++i) {
    const time = '"' + data.time[i] + '"';
    const temp = '"' + data.temperature_2m[i] + '"';

    const row = time + "," + temp + "\n";
    content += row;
  }

  await writeFile(file, content);
}

const latitude = 48.09585;
const longitude = 7.96371;

const result = await getWeather(latitude, longitude);
console.log(
  "Current temperature in Waldkirch:",
  result.current.temperature_2m.toFixed(1),
  "°C"
);

const file = "out/weather.csv";
await writeHistoryCSV(file, result.hourly);
console.log("Written weather history to", file);
