/**
 * This script queries the current weather via an API
 * and saves the result to a file.
 */

import assert from "node:assert";
import { writeFile } from "node:fs/promises";

interface CurrentWeather {
  time: string;
  interval: number;
  temperature_2m: number;
}

interface WeatherSeries {
  time: string[];
  temperature_2m: number[];
}

interface WeatherData {
  latitude: number;
  longitude: number;
  elevation: number;
  current: CurrentWeather;
  hourly: WeatherSeries;
}

async function getWeather(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  
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
  const body: WeatherData = await result.json();
  return body;
}

async function writeHistoryCSV(
  file: string,
  data: WeatherSeries
): Promise<void> {
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
