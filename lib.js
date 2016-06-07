// 'use strict';

// const Wit=require('node-wit').Wit;
// const express = require('express'),
//       router = express.Router(),
//       app=express(),
//       request = require('request'),
//       bodyParser=require('body-parser'),
//       Func=require('./../class/func');

    
// const FB_PAGE_ID=process.env.FB_PAGE_ID,
//       FB_PAGE_TOKEN=process.env.FB_PAGE_TOKEN,
//       WIT_TOKEN=process.env.WIT_TOKEN;
    
// var sessions = {};

// const findOrCreateSession = (fbid) => {
//   let sessionId;
//   // Let's see if we already have a session for the user fbid
//   Object.keys(sessions).forEach(k => {
//     if (sessions[k].fbid === fbid) {
//       // Yep, got it!
//       sessionId = k;
//     }
//   });
//   if (!sessionId) {
//     // No session found for user fbid, let's create a new one
//     sessionId = new Date().toISOString();
//     sessions[sessionId] = {fbid: fbid, context: {}};
//   }
//   return sessionId;
// };

// const firstEntityValue = (entities, entity) => {
//   const val = entities && entities[entity] &&
//     Array.isArray(entities[entity]) &&
//     entities[entity].length > 0 &&
//     entities[entity][0].value
//   ;
//   if (!val) {
//     return null;
//   }
//   return typeof val === 'object' ? val.value : val;
// };

// // See the Send API reference
// // https://developers.facebook.com/docs/messenger-platform/send-api-reference
// const fbReq = request.defaults({
//   uri: 'https://graph.facebook.com/me/messages',
//   method: 'POST',
//   json: true,
//   qs: { access_token: FB_PAGE_TOKEN },
//   headers: {'Content-Type': 'application/json'},
// });

// const fbMessage = (recipientId, msg, cb) => {
//   const opts = {
//     form: {
//       recipient: {
//         id: recipientId,
//       },
//       message: {
//         text: msg,
//       },
//     },
//   };
//   fbReq(opts, (err, resp, data) => {
//     if (cb) {
//       cb(err || data.error && data.error.message, data);
//     }
//   });
// };

// const say=(sessionId, context, message, cb) =>{
//     // Our bot has something to say!
//     // Let's retrieve the Facebook user whose session belongs to
//     const recipientId = sessions[sessionId].fbid;
//     if (recipientId) {
//       // Yay, we found our recipient!
//       // Let's forward our bot response to her.
//         fbMessage(recipientId, message, (err, data) => {
//         if (err) {
//           console.log(
//             'Oops! An error occurred while forwarding the response to',
//             recipientId,
//             ':',
//             err
//           );
//         }

//         // Let's give the wheel back to our bot
//         cb();
//       });
//     } else {
//       console.log('Oops! Couldn\'t find user for session:', sessionId);
//       // Giving the wheel back to our bot
//       cb();
//     }
//   }
  
// var extractEntity=function(entities,entity){
//   const val = entities && entities[entity] 
//   && Array.isArray(entities[entity])
//   && entities[entity].length > 0 &&
//     entities[entity][0].value;
    
//     console.log('value is ' + val);
//     if(val) return val;
//     else return false;
  
// }
// const actions = {say
//   ,
//   merge(sessionId, context, entities, message, cb) {
    
//     let local_query=extractEntity(entities,'local_search_query');
    
//     if(local_query)
//     {
//       switch (local_query) {
//       case 'weather':
//         context.intent="weather";
//         break;
//       default:
//         // context.intent="other_local";
//         // context.local_query=local_query;
//         break;
//     }
//     }
//     if(extractEntity(entities,'location')) context.location=extractEntity(entities,'location');
//       console.log(context);
//     cb(context);
    
//   },
//   error(sessionId, context, error) {
//     console.log(error.message);
//   },
//   ['find-local'](sessionId, context, cb) {
    
//     if(context.intent == 'weather'){
//       console.log('weather find event fired');
//       Func.weather(context.location,function(data){
//       console.log(data);
//       context.search_result=data;
//       context.done=true;
//       });
//     }
//     // else
//     // {
//     //   console.log("find other event fired");
//     //   Func.nearbysearch(context.location,context.local_query,function(data){
//     //     console.log(data);
//     //     context.search_result="swswsws";
//     //   })
//     // }
//     // context.search_result="dwdwd";
//     console.log('final context');
//     console.log(context);
//     cb(context);
    
//   }
// };



// const getFirstMessagingEntry = (body) => {
//   const val = body.object == 'page' &&
//     body.entry &&
//     Array.isArray(body.entry) &&
//     body.entry.length > 0 &&
//     body.entry[0] &&
//     body.entry[0].id == FB_PAGE_ID &&
//     body.entry[0].messaging &&
//     Array.isArray(body.entry[0].messaging) &&
//     body.entry[0].messaging.length > 0 &&
//     body.entry[0].messaging[0]
//   ;
//   return val || null;
// };

// // Setting up our bot
// const wit = new Wit(WIT_TOKEN, actions);


// // Facebook Webhook
// router.get('/webhook', function (req, res) {
//     console.warn('authentication called');
//     if (req.query['hub.verify_token'] === 'testbot_verify_token') {
//         res.send(req.query['hub.challenge']);
//     } else {
//         res.send('Invalid verify token');
//     }
// });


// // facebook hook post event
// router.post('/webhook',(req,res)=>{

//     const messaging = getFirstMessagingEntry(req.body);
    
//     if (messaging && messaging.message && messaging.recipient.id === FB_PAGE_ID) {
      
//       // We retrieve the Facebook user ID of the sender
//     var sender = messaging.sender.id;

//     // We retrieve the user's current session, or create one if it doesn't exist
//     // This is needed for our bot to figure out the conversation history
//     var sessionId = findOrCreateSession(sender);
    
//     var msg=messaging.message.text;
    
//     // We retrieve the message content
//     if(messaging.message.attachments)
//       // Let's reply with an automatic message
//       fbMessage(
//         sender,
//         'Sorry I can only process text messages for now.'
//       );
//     }
//     if(msg){
      
//       wit.runActions(
//         sessionId, // the user's current session
//         msg, // the user's message 
//         sessions[sessionId].context, // the user's current session state
//         (error, context) => {
//           if (error) {
//             console.log('Oops! Got an error from Wit:', error);
//           } else {
//             if(context['done']) {
//               console.log('clearing session ');
//               // delete sessions[sessionId];
//             }
//             // Our bot did everything it has to do.
//             // Now it's waiting for further messages to proceed.
//             console.log('context after wit');
//             console.log(context);

//             // Based on the session state, you might want to reset the session.
//             // This depends heavily on the business logic of your bot.
//             // Example:
//             // if (context['done']) {
//             //   delete sessions[sessionId];
//             // }

//             // Updating the user's current session state
//             sessions[sessionId].context = context;
//           }
//         }
//       );

//     }
    
//     res.sendStatus(200);
    
// });

// module.exports = router;


