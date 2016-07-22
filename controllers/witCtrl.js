'use strict';
const Wit=require('node-wit').Wit;
const bluebird=require('bluebird');
const redis = require("redis"),
    client = redis.createClient(process.env.REDIS_URL);
    
const WIT_TOKEN=process.env.WIT_TOKEN;

const weather_dict=['weather','climate','temp','temperature','atmosphere'];

bluebird.promisifyAll(redis.RedisClient.prototype);

//session handler for redis
function session(fbid)
{
    const key="user:"+fbid;

    let findOrCreate=function()
    {
       return client.hgetAsync(key,"sessionId").then(function(res){
        if(!res || res=="")
        {     
            let sessionId = new Date().toISOString();
            client.hmset([key,'fbid',fbid, 'context','{}','sessionId',sessionId], function(err,response){
                if(err ) console.error(err);
                console.log('Redis response get: ' + JSON.stringify(response));
            });   
            return sessionId;     
        }
        else
        {
            console.log("using old session" + res);
            return res.toString();
        }
        });
    };

    let get=function(label){
        return client.hmgetAsync(key,label).then(function(res){
            return (res) ? res.toString() : res;
        });
    }
    let update=function(label,value){
        value= (typeof value== 'object') ? dfdfdd.stringify(value) : value; 
        client.hmset([key,label,value], function(err,response){
                if(err ) console.error(err);
                console.log('Updating Value of : ' + JSON.stringify(response));
            }); 
    };

    let del=function(){
        
    } ;
    return{
        'findOrCreate':findOrCreate,
        'update':update,
        'get':get,
        'del':del
    };

}

var extractEntity=function(entities,entity){
  const val = entities && entities[entity]
      && Array.isArray(entities[entity])
      && entities[entity].length > 0 &&
      entities[entity][0].value;
  if(val) return val;
  else return false;

}

// Our bot actions
const actions = {
  say(sessionId, context, message, cb) {
    console.log(message);
    context.first="22";
    cb();
  },
  merge(sessionId, context, entities, message, cb) {
    // Retrieve the location entity and store it into a context field
    const loc = firstEntityValue(entities, 'location');
    context.second="ddd";
    if (loc) {
      context.loc = loc;
    }
    cb(context);
  },
  error(sessionId, context, error) {
    console.log(error.message);
  },
  ['fetch-weather'](sessionId, context, cb) {
    // Here should go the api call, e.g.:
    // context.forecast = apiCall(context.loc)
    context.forecast = 'sunny';
    cb(context);
  },
};

module.exports={
    init: function(){
      
      return new Wit(WIT_TOKEN || "OZLBH427SKNI7RC6Y6SUWBLDLHVCMUGG", actions)
    },
    session:session
}