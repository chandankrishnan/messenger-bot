'use strict';
const Wit=require('node-wit').Wit;
const bluebird=require('bluebird');
const redis = require("redis"),
      client = redis.createClient(process.env.REDIS_URL);
    
const WIT_TOKEN=process.env.WIT_TOKEN;

const weather_dict=['weather','climate','temp','temperature','atmosphere'];

bluebird.promisifyAll(redis.RedisClient.prototype);

//session handler using redis
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
        value= (typeof value== 'object') ? JSON.stringify(value) : value; 
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
    cb();
  },
  merge(sessionId, context, entities, message, cb) {
    // Retrieve the location entity and store it into a context field
    console.log('Merge Context : ' + JSON.stringify(context));
    const reminder = firstEntityValue(entities, 'reminder');
    const datetime=   firstEntityValue(entities, 'datetime');
    if (reminder) {
      context.reminder = reminder;
    }
    if(datetime)  context.datetime=datetime;
    cb(context);
  },
  error(sessionId, context, error) {
    console.log(error.message);
  },
  ['save-reminder'](sessionId, context, cb) {
    // Here should go the api call, e.g.:
    // context.forecast = apiCall(context.loc)
    console.log('context in save-reminder: ' + JSON.stringify(context));
    context.result="reminder saved";
    context.done=true;
    cb(context);
  },
};

module.exports={
    init: function(){
      
      return new Wit(WIT_TOKEN || "OZLBH427SKNI7RC6Y6SUWBLDLHVCMUGG", actions)
    },
    session:session
}