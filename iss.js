/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require("request");

const fetchMyIP = (callback) => {
  // use request to fetch IP address from JSON API
  request("https://api.ipify.org?format=json", (error, response, body) => {
    if (!error && response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    } else if (!error) {
      const data = JSON.parse(body);
      callback(error, data.ip);
      return;
    }
    callback(error, null);
  });
};

const fetchCoordsByIP = (ip, callback) => {
  request(URL = "https://api.freegeoip.app/json/" + ip + "?apikey=b87446a0-547e-11ec-aacb-d32028f123f1", (error, response, body) => {

    if (!error && response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    } else
      if (!error) {
        const coords = {};
        const data = JSON.parse(body);
        coords.latitude = data.latitude;
        coords.longitude = data.longitude;
        callback(error, coords);
        return;
      }
    callback(error, null);
  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  // ...
  request("https://iss-pass.herokuapp.com/json/?lat=" + coords.latitude + "&lon=" + coords.longitude, (error, response, body) => {

    if (!error && response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    } else
      if (!error) {
        const data = JSON.parse(body);
        const flyovers = data.response;
        callback(error, flyovers);
        return;
      }
    callback(error, null);
  });
};


const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };
