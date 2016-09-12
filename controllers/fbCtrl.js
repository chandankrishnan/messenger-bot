'use strict';
const express = require('express');
const router = express.Router();
const app = express();
const bodyParser = require('body-parser');
const FBMessenger = require('fb-messenger');
const Func = require('./../class/func');
// const redis = require("./../redisDB");
const Users = require('./../model/UserModel').userModel;
const ReminderModel = require('./../model/ReminderModel').reminderModel;
const Reminder = new ReminderModel();
const moment = require('moment');
const Wit = require('node-wit').Wit;
const log = require('node-wit').log;


const FB_PAGE_ID = process.env.FB_PAGE_ID || '1620191058306200';
const FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN || 'EAAHVizlMZBFkBAA6Ltx64kHqPypTgja5B1ez0QjeI2KP0zZCq5WnDvb153c4Ivn7Mk1fwmuR44LhE2XY6T2ZAgnNKC8DZARyxOLZB7AmX9HTohj1TExPZB9uxjsmTxcEkT2IksQNoxLl1p96YCfYGBTLbRU6R6R7DYbPGgxOYpuQZDZD';
const WIT_TOKEN = process.env.WIT_TOKEN || '66UZJUQ5DH4R2RO3GU6HMSM7BBHBZC75';
const APP_SECRET = '2c38ab8c7cd662fbafa6c4e75016f4c4';
const messenger = new FBMessenger(FB_PAGE_TOKEN);
const interactive = require('node-wit').interactive;


const firstEntityValue = function (entities, entity) {
    const val = entities && entities[entity]
        && Array.isArray(entities[entity])
        && entities[entity].length > 0 &&
        entities[entity][0].value;
    if (val) return val;
    else return false;

};
app.use(bodyParser.json({verify: verifyRequestSignature}));

const commands = {
    'setting': function () {

    }
}
const sessions = {};
const userSession = [];
const reminderCreatedReply1 = [
    {
        "content_type": "text",
        "title": "Set Notification",
        "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
    },
    {
        "content_type": "text",
        "title": "Delete",
        "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
    }
];
const reminderCreatedReply2 = [
    {
        "content_type": "text",
        "title": "Change Date",
        "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
    },
    {
        "content_type": "text",
        "title": "Delete",
        "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
    }
];

const createQuickReply = function (quickreply) {
    let result = [];
    quickreply.forEach(function (value, index) {

        let temp = {"content_type": "text", "title": value, "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"};
        result.push(temp);
    });
    return result;
}


// find or create user session and user in dataabse
const findOrCreateSession = (fbid) => {
    console.log("findOrCreateSession called");
    return new Promise(function (resolve, reject) {
        let sessionId = 0;
        // Let's see if we already have a session for the user fbid
        // console.log("creating new session");
        if(false){
            let sessionId = new Date().toISOString();
            userSession[sessionId] = {fbid: fbid, context: {}, logged: false};
            console.log("Message from PAGE");
            resolve(sessionId);
        }
        else{
            Object.keys(userSession).forEach(k => {
                if (userSession[k].fbid === fbid) {
                    // Yep, got it!
                    sessionId = k;
                    resolve(sessionId);
                }
                // console.log("old session ", userSession);
            });
            if (!sessionId) {
                // No session found for user fbid, let's create a new one
                sessionId = new Date().toISOString();
                Users.findOne({'facebook.id': fbid}, function (err, res) {
                    if (!res && !err) {
                        let u = new Users({'facebook.id': fbid});
                        u.save(function (err, data) {
                            userSession[sessionId] = {fbid: fbid, context: {}, logged: false, muser_id: u._id};
                            if (data) resolve(sessionId);
                            else reject(err);
                        });
                    }
                    else if (res) {
                        userSession[sessionId] = {fbid: fbid, context: {}, logged: false, muser_id: res._id};
                        console.log("existing user ",userSession);
                        resolve(sessionId);
                    }
                    else if (err) {
                        console.log("error in creating user");
                        reject(err);
                    }
                });
            }
        }
    }); //promise end
    // let sessionId = new Date().toISOString();
    // var res=[];
    // sessions[sessionId]={'fbid':fbid,'context':{}};
    // return sessionId;
};


// WIT.AI actions
const actions = {
    send(request, response) {
        console.log('---------runiing wit say action---------');
        console.log('request :',request);
        const {sessionId, context, entities} = request;
        const {text, quickreplies} = response;
        const recipientId = userSession[sessionId].fbid;
        console.log('recipient id ', recipientId);
        if (quickreplies) console.log('quick reply detected ', response);

        return new Promise(function (resolve, reject) {
            console.log(" sending message to :" + JSON.stringify(response));
            if (recipientId) {
                if (quickreplies) {
                    messenger.sendQuickRepliesMessage(recipientId, text, createQuickReply(quickreplies), function (err, body) {
                        if (err) console.error("in sending quick reply ", err,userSession);
                        console.log(body);
                        resolve();
                    });
                }
                else {
                    messenger.sendTextMessage(recipientId, text, function (err, body) {
                        if (err) console.error('in sending text message ', err ,userSession);
                        console.log('response ', response);
                        console.log('Message sent', body);
                        resolve();
                    });
                }
            }
            else {
                console.log('inside say without id');
                resolve();
            }
        });
    },
    merge({entities, context, message, sessionId}) {
        console.log("res in merge : ",context,entities);
    },
    showReminder({sessionId, context, text, entities}) {
        console.log("showReminder fired");
        const intent = firstEntityValue(entities, 'intent');

        return new Promise(function (resolve, reject) {
            if (intent == 'show-reminder') {
                console.log("-----This is reminder list ");
            }
            resolve(context);
        });
    },
    saveReminder({sessionId, context, text, entities}) {
        console.log('saveReminder Fired',context);
        // console.log('Entities ',entities);
        let rem = [];
        const reminder= firstEntityValue(entities, 'reminder');
        const datetime = firstEntityValue(entities, 'datetime');

        if(datetime){
            console.log("setting datetime");

            rem.date=datetime;
            context.date=datetime;
        }
        if(reminder){
            console.log("setting reminder");
            context.reminder=reminder;
            rem.title=reminder;
        }

        // let date_diff = (datetime) ? moment(datetime).diff(new Date()) : 0;
        return new Promise(function (resolve, reject) {
            if(!datetime) {
                console.log("setting missingDate");
                context.missingDate = true;
                resolve(context);
            }
            else if(reminder) {
                console("saving reminder");
                rem.user_id = userSession[sessionId].muser_id;
                Reminder.create(rem).then(function (res) {
                    console.log('reminder created');
                    context.reminder_result="Reminder created."
                    context.done = true;
                    resolve(context);
                }, function (err) {
                    console.log("error in saving reminder ", err);
                    context.done = true;
                    resolve(context);
                });
            }
            else resolve(context);
        });
    },
    getForecast({sessionId, context, text, entities}) {
        console.log('getForecast Fired');
        console.log("entities " + JSON.stringify(entities));
        const intent = firstEntityValue(entities, 'intent');
        const location = firstEntityValue(entities, 'location');
        return new Promise(function (resolve, reject) {
            if (!location) context.missingLocation = true;
            if (intent == 'weather' && location) {
                Func.weather(location, function (forecast) {
                    console.log("weather data " + forecast);
                    context.weather_result = forecast;
                    context.missingLocation = true;
                    context.done = true;
                    console.log("first context");
                    resolve(context);
                });
            }
            console.log("second context");
            resolve(context);
        });
    }

};

// initializing Wit
const wit = new Wit({
    accessToken: WIT_TOKEN,
    actions
    // logger: new log.Logger(log.INFO)
});

// Facebook Webhook
router.get('/webhook', function (req, res) {
    console.warn('authentication called');
    if (req.query['hub.verify_token'] === 'testbot_verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

router.post('/webhook', (req, res) => {
    // Parse the Messenger payload
    // See the Webhook reference
    // https://developers.facebook.com/docs/messenger-platform/webhook-reference

    console.log('webhook reached');

    const data = req.body;

    if (data.object === 'page') {
        data.entry.forEach(entry => {
            console.log("running loop 1");
            entry.messaging.forEach(event => {
            console.log("running loop 2 event " ,event);
                if (event.message)
                {
                  const recipient=event.recipient.id;

                    // We retrieve the message content
                    const message = event.message;
                        if (message.attachments) {

                        } else if ((message.text && !message.is_echo)) {

                            // We retrieve the user's current session, or create one if it doesn't exist
                            // This is needed for our bot to figure out the conversation history
                               const sender = (event.sender.id==FB_PAGE_ID) ? event.recipient.id : event.sender.id;

                               findOrCreateSession(sender).then(function (sessionId) {
                                   console.log("session created with sessionID= ",sessionId);
                                   wit.runActions(
                                       sessionId,
                                       message.text, // the user's message
                                       userSession[sessionId].context // the user's current session state
                                   ).then((context) => {
                                       console.log('Wit Bot haS completed its action');
                                       if (context['done']) {
                                           console.log("clearing session data" + JSON.stringify(userSession));
                                           delete userSession[sessionId];
                                       }
                                       else {
                                           console.log("updating session data");
                                           // Updating the user's current session state
                                           userSession[sessionId].context = context;

                                       }
                                   });
                               }).catch((err)=>{
                                   console.log('Oops! Got an error from Wit: ', err.stack || err);
                               });
                        }
                        else if (message.quick_reply) {
                            console.log("Quick reply received ", message);
                        }
                    }
                else {
                    console.log('received event', JSON.stringify(event));
                }
            });
        });
    }
    res.sendStatus(200);
});

/*
 * Message Event
 *
 * This event is called when a message is sent to your page. The 'message'
 * object format can vary depending on the kind of message that was received.
 * Read more at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-received
 */

// function receivedMessage(event, sessionId) {
//     console.log('Event ', event);
//     var senderID = event.sender.id;
//     var recipientID = event.recipient.id;
//     var timeOfMessage = event.timestamp;
//     var message = event.message;

//     // You may get a text or attachment but not both
//     var messageText = message.text;
//     var messageAttachments = message.attachments;
//     var quickReply = message.quick_reply;
//     if (quickReply) console.log('inside quickreply ', quickReply);
//     if (messageText) {
//         console.log("finding session ID ", senderID);
//         console.log("reached runWitAction");
//         wit.runActions(
//             sessionId, // the user's current session
//             msg, // the user's message
//             sessions[sessionId].context // the user's current session state
//         ).then((context) => {
//             console.log('Wit Bot haS completed its action');
//             if (context['done']) {
//                 console.log("clearing session data" + JSON.stringify(sessions));
//                 delete sessions[sessionId];
//             }
//             else {
//                 console.log("updating session data");
//                 // Updating the user's current session state
//                 sessions[sessionId].context = context;
//             }
//         }).catch((err) => {
//             console.error('Oops! Got an error from Wit: ', err.stack || err);
//         });
//     }
//     else if (quickReply) {
//         console.log("Quick Reply recived ", quickReply);
//     }
//     else if (messageAttachments) {
//         messenger.sendTextMessage(senderID, "Sorry, I can only process text messages for now.");
//     }
// }

/*
 * Postback Event
 *
 * This event is called when a postback is tapped on a Structured Message.
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/postback-received
 *
 */
function receivedPostback(event, sessionId) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfPostback = event.timestamp;

    // The 'payload' param is a developer-defined field which is set in a postback
    // button for Structured Messages.
    var payload = event.postback.payload;

    console.log("Received postback for user %d and page %d with payload '%s' " +
        "at %d", senderID, recipientID, payload, timeOfPostback);

}

/*
 * Wit.ai Actions
 *
 * This event is fired when you receive text message from messenger
 * and pass it to wit.ai
 * Read more at https://github.com/wit-ai/node-wit
 * */
// function runWitAction(sessionId, msg) {
//     console.log("reached runWitAction");
//     wit.runActions(
//         sessionId, // the user's current session
//         msg, // the user's message
//         sessions[sessionId].context // the user's current session state
//     ).then((context) => {
//         console.log('Wit Bot haS completed its action');
//         if (context['done']) {
//             console.log("clearing session data" + JSON.stringify(sessions));
//             delete sessions[sessionId];
//         }
//         else {
//             console.log("updating session data");
//             // Updating the user's current session state
//             sessions[sessionId].context = context;
//         }
//     }).catch((err) => {
//         console.error('Oops! Got an error from Wit: ', err.stack || err);
//     });
// }
function verifyRequestSignature(req, res, buf) {
    var signature = req.headers["x-hub-signature"];

    if (!signature) {
        // For testing, let's log an error. In production, you should throw an
        // error.
        console.error("Couldn't validate the signature.");
    } else {
        var elements = signature.split('=');
        var method = elements[0];
        var signatureHash = elements[1];

        var expectedHash = crypto.createHmac('sha1', APP_SECRET)
            .update(buf)
            .digest('hex');

        if (signatureHash != expectedHash) {
            throw new Error("Couldn't validate the request signature.");
        }
    }
}
module.exports = router;