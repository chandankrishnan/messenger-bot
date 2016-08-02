'use strict';

const bluebird=require('bluebird');
const redis = require("redis");

const redis_url=process.env.REDIS_URL || "redis://h:p2sd4j5e3448iu2tacphihpptrs@ec2-23-23-126-210.compute-1.amazonaws.com:28019";
var client='';

// temrinal command 
//heroku redis:cli -a aalooapp-production -c aalooapp-production

//promisfy all redis method
bluebird.promisifyAll(redis.RedisClient.prototype);

exports.client= client= (!client) ?  redis.createClient(redis_url) : client;
