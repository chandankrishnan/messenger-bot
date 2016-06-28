'use strict';
const Wit=require('node-wit').Wit;
const WIT_TOKEN=process.env.WIT_TOKEN;
const sessions=[];

const weather_dict=['weather','climate','temp','temperature','atmosphere'];

const findOrCreateSession = (fbid) => {
    let sessionId='';
    Object.keys(sessions).forEach(k => {
        if (sessions[k].fbid === fbid) {
            // Yep, got it!
             sessionId = k;
        }
        console.log('using old session');
    });
    if (!sessionId) {
        // No session found for user fbid, let's create a new one
          sessionId = new Date().toISOString();
         sessions[sessionId] = {fbid: fbid, context: {}};
        console.log("new session created :" + JSON.stringify(sessions));
    }

    return sessionId;
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
// Our bot actions
const actions = {
  say(sessionId, context, message, cb) {

    // Our bot has something to say!
    // Let's retrieve the Facebook user whose session belongs to
    const recipientId = sessions[sessionId].fbid;
    if (recipientId) {
      // Yay, we found our recipient!
      // Let's forward our bot response to her.
        console.log("sent message to messenger " + message);
          messenger.sendTextMessage(recipientId, message);

        // Let's give the wheel back to our bot
        cb();
    } else {
      console.log('Oops! Couldn\'t find user for session:', sessionId);
      // Giving the wheel back to our bot
      cb();
    }

    console.log("context before action");
    console.log(context);
  },

  merge(sessionId, context, entities, message, cb) {
    console.log('Entities form merge:' + JSON.stringify(entities));
    //clear search result
    if(context.search_result) delete context.search_result;

    let local_query=extractEntity(entities,'local_search_query');
    let entertainment=extractEntity(entities,'entertainment');
    if(local_query)
    {
      if(weather_dict.indexOf(local_query) != -1 ) context.intent="weather";
      else context.intent="local_query";
    }
    if(entertainment)
    {
        switch(entertainment)
        {
            case 'cinema':
                context.intent=entertainment;
                break;
        }
    }
    // merge location if exist
    if(extractEntity(entities,"location")) context.location=extractEntity(entities,"location");
    console.log("context after merge");
    console.log(context);
    cb(context);
  },
  error(sessionId, context, error) {
    console.log(error.message);
  },['find-local'](sessionId, context, cb) {
    console.warn('firing find-local action context' + JSON.stringify(context));
    // Here should go the api call, e.g.:
    // context.forecast = apiCall(context.loc)
    if(context.intent=="weather")
    {
      console.log('inside weather condition');
      // delete context.search_result;
      Func.weather(context.location,function(data){
        console.log('finding weather');
        context.search_result=data.toString();
        console.log('searhc data set through weather event' + JSON.stringify(context));
        context.done=true;
        cb(context);
      });
    }
        else cb(context);
  },

  ['find-cinema'](sessionId,context,cb)
  {
      console.warn('firing find-cinema action context' + JSON.stringify(context));
    if(context.intent=="entertainment") {
        console.log('inside find cinmea loop');
        //Func.movieTheater(context.location,function(data){
        //  context.search_result="your movie list";
        //  context.done=true;
        //  messenger.sendHScrollMessage(session[sessionId].fbid,data,function(err,body){
        //  });
        //  cb(context);
        //});
        context.search_result = "your movie list";
        context.done = true;
        cb(context);
    }
      else cb(context);
  }

  // You should implement your custom actions here
  // See https://wit.ai/docs/quickstart
};
module.exports={
    init: function(){
      sessions.length=0;
      return new Wit(WIT_TOKEN, actions)
    },
    findOrCreateSession:findOrCreateSession,
    session:sessions
}