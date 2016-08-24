// 'use strict';

// const bluebird=require('bluebird');
// const redis = require("redis");

// const redis_url="redis://h:pc0924q4lm4fvabg06f638rivs9@ec2-23-23-233-73.compute-1.amazonaws.com:15589";
// // var client=(!client) ?  redis.createClient(redis_url) : client;
// var client=redis.createClient(redis_url);
// client.on("error", function (err) {
//     console.log("Error " + err);
// });
// // temrinal command 
// //heroku redis:cli -a aalooapp-production -c aalooapp-production

// //promisfy all redis method
// bluebird.promisifyAll(redis.RedisClient.prototype);

// exports.client= client;
