/**
 * define modeule dependencies
 */
var request = require('request'),
    moment = require('moment'),
    geocode = require('google-geocode'),
    cricapi = require("node-cricapi"),
    showtimes = require("showtimes");
/**
 * @exports {nearbysearch,weather,cricMatch,movieTheater}
 */
module.exports = {
    /**
     * find any search in ur nearest location
     * param {location,search,cb}
     * return {body}
     */
    nearbysearch : function(location, search, cb) {
        geocode.setApiKey('AIzaSyDnT1tOkCdp7ZLyLyOa3OYGs8X6cKFaNPc');
        geocode.getGeocode(location, function(results, status) {
            var a = JSON.parse(results),
                uri = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';
            uri += 'location=' + a.results[0].geometry.location.lat + ',' + a.results[0].geometry.location.lng;
            uri += '&radius=500&types=' + search; //+search;
            uri += '&key=AIzaSyDnT1tOkCdp7ZLyLyOa3OYGs8X6cKFaNPc';
            request(uri, function(err, res, body) {
                cb(JSON.parse(body));
            })
        });
    },
    /**
     * find weather of location
     * param {location,cb}
     * return {weather}
     */
    weather : function(location, cb) {
        var APPID = "f5f23a05ff5d8a89d845872adc352bd4",
            type = "weather",
            uri = "http://api.openweathermap.org/data/2.5/" + type;
        uri += "?q=" + location;
        uri += "&APPID=" + APPID;
        uri += "&units=imperial";

        if (type === "weather") {
            request(uri, function(err, res, body) {
                var data = JSON.parse(body),
                    weather = "In " + data.name + ", I see " + data.weather[0].description + " ! ";
                weather += " Temp: " + Math.floor(data.main.temp) + " degrees(F)";
                weather += " Humidity: " + data.main.humidity + " %";
                weather += " Wind: " + Math.floor(data.wind.speed) + " mph";
                weather += " Cloud Cover :" + data.clouds.all + " %";
                cb(weather);
            });
        }
    },
    /**
     * find get cricket matches
     * params {cb}
     * return {data}
     */
    cricMatch : function(cb) {
        cricapi.cricketMatches(function(data) {
            cb(data);
        })
    },
    /**
     * find the movie theater of ur location
     * @params {location,cb}
     * @return {theaters}
     */
    movieTheater : function(location, cb) {
        var api = new showtimes(location);
        api.getTheaters(function(error, theaters) {
            if (error) {
                cb(error);
            } else {
                cb(theaters);
            }
        });
    }
}