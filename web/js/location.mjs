/**
 * @typedef {Object} LocationResult
 * @property {number} id - Unique identifier for the location.
 * @property {string} name - Name of the location.
 * @property {number} latitude - Latitude of the location.
 * @property {number} longitude - Longitude of the location.
 * @property {number} elevation - Elevation in meters.
 * @property {string} feature_code - Feature classification code (e.g. PPLC, PPL).
 * @property {string} country_code - ISO 3166-1 alpha-2 country code.
 * @property {number} admin1_id - Identifier for the first-level administrative division.
 * @property {number} [admin2_id] - Identifier for the second-level administrative division.
 * @property {number} [admin3_id] - Identifier for the third-level administrative division.
 * @property {number} [admin4_id] - Identifier for the fourth-level administrative division.
 * @property {string} timezone - Time zone string (e.g. "Europe/Berlin").
 * @property {number} population - Population count.
 * @property {string[]} postcodes - Array of associated postal codes.
 * @property {number} country_id - Identifier for the country.
 * @property {string} country - Full name of the country.
 * @property {string} admin1 - Name of the first-level administrative division.
 * @property {string} [admin2] - Name of the second-level administrative division.
 * @property {string} [admin3] - Name of the third-level administrative division.
 * @property {string} [admin4] - Name of the fourth-level administrative division.
 */

/**
 * @typedef {Object} LocationResponse
 * @property {LocationResult[]} results - List of location results.
 * @property {number} generationtime_ms - Time taken to generate the response in milliseconds.
 */

/**
 * Search for a location given a query string using the Open-Meteo API.
 *
 * @param {string} query
 * @returns {Promise<LocationResponse>}
 */
export async function searchLocation(query) {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.append("name", query);
  url.searchParams.append("count", "10");
  url.searchParams.append("language", "en");
  url.searchParams.append("format", "json");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      "Location error: " + response.status + " " + response.statusText
    );
  }
  return response.json();
}
