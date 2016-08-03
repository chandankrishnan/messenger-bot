'use strict';

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
              let data=JSON.parse(body);
              let elements=[];
              data.results.forEach(function(data,index){
                // results[index]={name:data.name,vicinity:data.vicinity};
                elements[index]={ title:(data.name.length >= 80) ? data.name.substr(-75) + ' ...' : data.name,
                                  subtitle:(data.subtitle)?(data.subtitle.length >= 80) ? data.subtitle.substr(-75) + '...' : data.subtitle : "No address",
                                  buttons:[
                                    {
                                      "type":"web_url",
                                      "url":"https://petersapparel.parseapp.com/view_item?item_id=100",
                                      "title":"Google Search"
                                    },
                                    {
                                      "type":"web_url",
                                      "url":"https://petersapparel.parseapp.com/buy_item?item_id=100",
                                      "title":"Buy Item"
                                    },
                                    {
                                      "type":"postback",
                                      "title":"Bookmark Item",
                                      "payload":"USER_DEFINED_PAYLOAD_FOR_ITEM100"
                                    }]
                                  }
                });
                var results={ "attachment":{ "type":"template", "payload":{
              "template_type":"generic", "elements":elements } } };
                cb(results);
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
        uri += "&units=metric";

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
              let elements=[];
              theaters.forEach(function(data,index){
                // results[index]={name:data.name,vicinity:data.vicinity};
                    if(index <= 9)
                    {
                        elements[index]={ title:(data.name.length >= 80) ? data.name.substr(-75) + ' ...' : data.name,
                            subtitle: (data.address)?(data.address.length >= 80) ? data.address.substr(-75) + '...' : data.address : "No address" ,
                            buttons:[
                                {
                                    "type":"web_url",
                                    "url":"https://petersapparel.parseapp.com/view_item?item_id=100",
                                    "title":"Google Search"
                                },
                                {
                                    "type":"postback",
                                    "title":"Bookmark Item",
                                    "payload":"USER_DEFINED_PAYLOAD_FOR_ITEM100"
                                }]
                        }
                    }

                });
                //{ "attachment":{ "type":"template", "payload":{
                //    "template_type":"generic", "elements":elements } } };
                var results=elements;

                cb(results);

            }
        });
    }
}
