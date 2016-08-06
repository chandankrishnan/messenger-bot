'use strict';
const express = require('express'),
    router = express.Router(),
    app=express(),
    FBMessenger = require('fb-messenger'),
    WitCtrl=require('./wit'),
    Session=require('./../session');

const FB_PAGE_ID=process.env.FB_PAGE_ID || '1620191058306200',
    FB_PAGE_TOKEN=process.env.FB_PAGE_TOKEN;
    
const messenger = new FBMessenger(FB_PAGE_TOKEN);

// Setting up our bot
// const wit = WitCtrl.init();
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
   
    // let sessionId =Session.findOrCreate(sender);

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
      WitCtrl.Wit(msg,function(ent){
        console.log('firing wit ');
         if(ent.intent[0].value =='weather') weather(ent,sender);
      });
      
    }
  }
  res.sendStatus(200);
});

function weather(entities,sender)
{
  console.log('reached inside weather ' + JSON.stringify(entities) + sender);
  console.log("location " + entities.location);
  if(!entities.location){
    console.log("sending no location defined");
    messenger.sendTextMessage(sender, 'Where Exactly ?');
  }
  if(entities.location)
  {
    console.log("sending with location");
    messenger.sendTextMessage(sender, 'This is weather');
  }
}
module.exports = router;