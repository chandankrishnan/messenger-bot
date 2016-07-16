'use strict';
const Wit=require('node-wit').Wit;
const bluebird=require('bluebird');
const redis = require("redis"),
    client = redis.createClient(process.env.REDIS_URL);
    
const WIT_TOKEN=process.env.WIT_TOKEN;
const sessions=[];

const weather_dict=['weather','climate','temp','temperature','atmosphere'];

bluebird.promisifyAll(redis.RedisClient.prototype);

const findOrCreateSession = (fbid) => {
    let sessionId='';
    const key='user:'+fbid;
    // Object.keys(sessions).forEach(k => {
    //     if (sessions[k].fbid === fbid) {
    //         // Yep, got it!
    //          sessionId = k;
    //     }
    //     console.log('using old session');
    // });
    // if (!sessionId) {
    //     // No session found for user fbid, let's create a new one
    //       sessionId = new Date().toISOString();
    //       const val= {fbid: fbid, context: {}};
    //     console.log("new session created :" + JSON.stringify(sessions));
    // }
    // //redis 
    return client.getAsync(key).then(function(res){
      if(!res)
      {
        sessionId = new Date().toISOString();
        client.set(key,{fbid: fbid, context: {}}, redis.print);
        return sessionId;
      }
      else
      {
        return res;
      }
    })
    
};

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
  send(request, response) {
    const sessionId=request.sessionId,
          context=request.context,
          entities=request.entities;

    console.log(entities);
    let intent=firstEntityValue(request.entities, 'intent');
    let location=firstEntityValue(request.entities, 'location');
    if(location) context.location=location;
    if(intent) context.intent=intent;
    console.log('reciving... ' + JSON.stringify(request.context));

    const text=response.text,
       quickreplies= response.quickreplies;

    return new Promise(function(resolve, reject) {
      console.log('sending...', JSON.stringify(response));
      return resolve();
    });
  },
  ['fetch-weather'](context, entities) {
    return new Promise(function(resolve, reject) {
      var location = firstEntityValue(entities, 'location');
      if(location) context.location=location;
      console.log('location ' + JSON.stringify(context));
      if (location) {
        context.forecast = 'sunny in ' + location; // we should call a weather API here
        delete context.missingLocation;
      } else {
        context.missingLocation = true;
        delete context.forecast;
      }
      return resolve(context);
    });
  },
   getLocation(context, entities) {
    return new Promise(function(resolve, reject) {
      
      return resolve(context);
    });
  },
};

module.exports={
    init: function(){
      sessions.length=0;
      return new Wit(WIT_TOKEN, actions)
    },
    findOrCreateSession:findOrCreateSession,
    session:sessions
}