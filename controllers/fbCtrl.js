'use strict';
const express = require('express'),
    router = express.Router(),
    app=express(),
    Func=require('./../class/func'),
    FBMessenger = require('fb-messenger'),
    Wit=require('./witCtrl');

const FB_PAGE_ID=process.env.FB_PAGE_ID,
    FB_PAGE_TOKEN=process.env.FB_PAGE_TOKEN;
    
const messenger = new FBMessenger(FB_PAGE_TOKEN);

// Setting up our bot
const wit = Wit.init;
//bot sessions
const sessions=Wit.session; 

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
    console.log('reached if condition of webhook');
    // Yay! We got a new message!
    // We retrieve the Facebook user ID of the sender
    const sender = messaging.sender.id;

    // We retrieve the user's current session, or create one if it doesn't exist
    // This is needed for our bot to figure out the conversation history
    let sessionId = findOrCreateSession(sender);

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