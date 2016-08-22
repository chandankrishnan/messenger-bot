'use strict';
const express = require('express'),
  router = express.Router(),
  app = express(),
  FBMessenger = require('fb-messenger'),
  WitCtrl = require('./witCtrl'),
  Session = require('./../session');
const Func = require('./../class/func');

const FB_PAGE_ID = process.env.FB_PAGE_ID || '1620191058306200',
  FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN || 'EAAHVizlMZBFkBAA6Ltx64kHqPypTgja5B1ez0QjeI2KP0zZCq5WnDvb153c4Ivn7Mk1fwmuR44LhE2XY6T2ZAgnNKC8DZARyxOLZB7AmX9HTohj1TExPZB9uxjsmTxcEkT2IksQNoxLl1p96YCfYGBTLbRU6R6R7DYbPGgxOYpuQZDZD';

const messenger = new FBMessenger(FB_PAGE_TOKEN);

// Setting up our bot
const wit = WitCtrl.init();
//bot sessions
// const findOrCreateSession=Wit.findOrCreateSession;
// const sessions=Wit.session; 

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

  const messaging = getFirstMessagingEntry(req.body);

  if (messaging && messaging.message && messaging.recipient.id == FB_PAGE_ID) {
    console.log('reached if condition of webhook');
    // Yay! We got a new message!
    // We retrieve the Facebook user ID of the sender
    const sender = messaging.sender.id;

    // We retrieve the user's current session, or create one if it doesn't exist
    // This is needed for our bot to figure out the conversation history

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
      const sessionData=Session.findOrCreate(sender);
      
        console.log('Session Data:' + sessionData);
        wit.runActions(
          sessionData.sessionID, // the user's current session
          msg, // the user's message
          sessionData.context // the user's current session state
        ).then((context) => {
          console.log('Wit Bot haS completed its action');
          if (context['done']) {
            console.log("clearing session data");
            Session.del(sender);
          }
          console.log("updating session data");
          // Updating the user's current session state
          Session.update(sender,'context',context);
        }).catch((err) => {
          console.error('Oops! Got an error from Wit: ', err.stack || err);
        });


    } //end else if
  }
  res.sendStatus(200);
});

module.exports = router;