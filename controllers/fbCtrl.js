'use strict';

const Wit=require('node-wit').Wit;
const express = require('express'),
    router = express.Router(),
    app=express(),
    request = require('request'),
    bodyParser=require('body-parser'),
    Func=require('./../class/func'),
    FBMessenger = require('fb-messenger'),
    session=require('./../class/session');

const FB_PAGE_ID=process.env.FB_PAGE_ID,
    FB_PAGE_TOKEN=process.env.FB_PAGE_TOKEN,
    WIT_TOKEN=process.env.WIT_TOKEN;

const weather_dict=['weather','temp','temperature','rain'];
const messenger = new FBMessenger(FB_PAGE_TOKEN);



var extractEntity=function(entities,entity){
  const val = entities && entities[entity]
      && Array.isArray(entities[entity])
      && entities[entity].length > 0 &&
      entities[entity][0].value;
  if(val) return val;
  else return false;

}

// See the Webhook reference
// https://developers.facebook.com/docs/messenger-platform/webhook-reference
const getFirstMessagingEntry = (body) => {
  const val = body.object == 'page' &&
          body.entry &&
          Array.isArray(body.entry) &&
          body.entry.length > 0 &&
          body.entry[0] &&
          body.entry[0].id == FB_PAGE_ID &&
          body.entry[0].messaging &&
          Array.isArray(body.entry[0].messaging) &&
          body.entry[0].messaging.length > 0 &&
          body.entry[0].messaging[0]
      ;
  return val || null;
};

const sessions=[];

//var findOrCreateSession = (fbid) => {
//  const Session=new session(fbid);
//  sessions=Session.get();
//    console.log('Sessions data' + JSON.stringify(sessions));
//  return Session.sessionID();
//};
const findOrCreateSession = (fbid) => {
    Object.keys(sessions).forEach(k => {
        if (sessions[k].fbid === fbid) {
            // Yep, got it!
            const sessionId = k;
        }
        console.log('using old session');
    });
    if (!sessionId) {
        // No session found for user fbid, let's create a new one
         const sessionId = new Date().toISOString();
         sessions[sessionId] = {fbid: fbid, context: {}};
        console.log("new session created :" + JSON.stringify(sessions));
    }

    return sessionId;
};

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
    console.log(entities);
    if(context.search_result) delete context.search_result;


    let local_query=extractEntity(entities,'local_search_query');
    let entertainment=extractEntity(entities,'entertainment');
    if(local_query)
    {
      if(local_query=="weather") context.intent="weather";
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
    if(context.intent=="entertainment")
    {
      console.log('inside find cinmea loop');
      //Func.movieTheater(context.location,function(data){
      //  context.search_result="your movie list";
      //  context.done=true;
      //  messenger.sendHScrollMessage(session[sessionId].fbid,data,function(err,body){
      //  });
      //  cb(context);
      //});
        context.search_result="your movie list";
        context.done=true;
    }
    else cb(context);

  }

  // You should implement your custom actions here
  // See https://wit.ai/docs/quickstart
};

const finshSession=(sID)=>
{
  console.log('deleting sessions');
  delete sessions[sID];
}
// Setting up our bot
const wit = new Wit(WIT_TOKEN, actions);



// Facebook Webhook
router.get('/webhook', function (req, res) {
  console.warn('authentication called');
  if (req.query['hub.verify_token'] === 'testbot_verify_token') {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('Invalid verify token');
  }
});


// Message handler
router.post('/webhook', (req, res) => {
  // Parsing the Messenger API response
    let location={lat:'',long:''};
  console.log("reached inside hook post" + JSON.stringify(req.body));
  const messaging = getFirstMessagingEntry(req.body);
  if (messaging && messaging.message && messaging.recipient.id == FB_PAGE_ID) {
    // Yay! We got a new message!
    // We retrieve the Facebook user ID of the sender
    const sender = messaging.sender.id;

    // We retrieve the user's current session, or create one if it doesn't exist
    // This is needed for our bot to figure out the conversation history
    const sessionId = findOrCreateSession(sender);

    // We retrieve the message content
    const msg = messaging.message.text;
    const atts = messaging.message.attachments;

    if (atts) {
      // We received an attachment
        messenger.sendTextMessage(sender, 'Sorry I can only process text messages for now.');
    } else if (msg) {
      // We received a text message
      // Let's forward the message to the Wit.ai Bot Engine
      // This will run all actions until our bot has nothing left to do
      wit.runActions(
          sessionId, // the user's current session
          msg, // the user's message
          sessions[sessionId].context, // the user's current session state
          (error, context) => {
            if (error) {
              console.log('Oops! Got an error from Wit:', error);
            } else {
              // Our bot did everything it has to do.
              // Now it's waiting for further messages to proceed.
              console.log('Waiting for futher messages.');

              // Based on the session state, you might want to reset the session.
              // This depends heavily on the business logic of your bot.
              // Example:
              if (context['done']) {
                delete sessions[sessionId];
              }

              // Updating the user's current session state
              sessions[sessionId].context = context;
            }
          }
      );
    }
  }
  res.sendStatus(200);
});
module.exports = router;
