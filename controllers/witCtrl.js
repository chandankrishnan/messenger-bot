'use strict';
const Wit=require('node-wit').Wit;
const bluebird=require('bluebird');
const redis = require("redis"),
    client = redis.createClient(process.env.REDIS_URL);
    
const WIT_TOKEN=process.env.WIT_TOKEN;

const weather_dict=['weather','climate','temp','temperature','atmosphere'];

bluebird.promisifyAll(redis.RedisClient.prototype);

const findOrCreateSession = (fbid) => {
    let sessionId='';
    const key='user:'+fbid;
   console.log('findOrCreate Session called');
    return client.getAsync(key).then(function(res){
      if(!res)
      {
        console.log("new session created");
        sessionId = new Date().toISOString();
        let val={fbid: fbid, context: {},sessionId:sessionId};
        client.hmset([key,'fbid',fbid, 'context','{}','sessionId',sessionId], function(err,response){
            console.log('Redis response get: ' + JSON.stringify(response));
        });
        return val;
      }
      else
      {
        console.log("using old session" + res);
        return res;
      }
    })
};

const updateSession=(fbid,key,val)=>{
  console.log('updating session ');
  const key1='user:'+fbid;
   client.hmset([key1,key,val], function(err,response){
            console.log('Redis: Field updated ' + response);
        });
}

const deleteSession=(fbid,key)=>{
  const key1='user:'+fbid;
   
   client.hdel([key1,key], function(err,response){
       console.log('Redis: field deleted' +  response);
    });
}
// const sessions=(fbid)=>{
// return client.getAsync(key).then(function(res){
//       if(!res)
//       {
//         sessionId = new Date().toISOString();
//         client.set(key,{fbid: fbid, context: {}}, redis.print);
//         return sessionId;
//       }
//       else
//       {
//         return res;
//       }
//     })
// }
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
    cb();
  },
  merge(sessionId, context, entities, message, cb) {
    // Retrieve the location entity and store it into a context field
    const loc = firstEntityValue(entities, 'location');
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
    findOrCreateSession:findOrCreateSession,
    updateSession:updateSession,
    deleteSession:deleteSession
}