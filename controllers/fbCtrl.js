'use strict';
const express = require('express');
const router = express.Router();
const app = express();
const FBMessenger = require('fb-messenger');
// const Session = require('./../session');
const Func = require('./../class/func');
// const redis = require("./../redisDB");
const Users = require('./../model/UserModel').userModel;
const ReminderModel = require('./../model/ReminderModel').reminderModel;
const Reminder=new ReminderModel();
const moment = require('moment');
const Wit = require('node-wit').Wit;
const log = require('node-wit').log;
const FB_PAGE_ID = process.env.FB_PAGE_ID || '1620191058306200';
const FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN || 'EAAHVizlMZBFkBAA6Ltx64kHqPypTgja5B1ez0QjeI2KP0zZCq5WnDvb153c4Ivn7Mk1fwmuR44LhE2XY6T2ZAgnNKC8DZARyxOLZB7AmX9HTohj1TExPZB9uxjsmTxcEkT2IksQNoxLl1p96YCfYGBTLbRU6R6R7DYbPGgxOYpuQZDZD';
const WIT_TOKEN = process.env.WIT_TOKEN || 'OZLBH427SKNI7RC6Y6SUWBLDLHVCMUGG';
const messenger = new FBMessenger(FB_PAGE_TOKEN);

const firstEntityValue = function (entities, entity) {
    const val = entities && entities[entity]
        && Array.isArray(entities[entity])
        && entities[entity].length > 0 &&
        entities[entity][0].value;
    if (val) return val;
    else return false;

};

const commands={
    'setting':function()
    {

    }
}
const sessions = {};
const reminderCreatedReply1= [
    {
        "content_type":"text",
        "title":"Set Notification",
        "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
    },
    {
        "content_type":"text",
        "title":"Delete",
        "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
    }
];
const reminderCreatedReply2= [
    {
        "content_type":"text",
        "title":"Change Date",
        "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
    },
    {
        "content_type":"text",
        "title":"Delete",
        "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
    }
];
// find or create user session and user in dataabse
const findOrCreateSession = (fbid) => {
    return new Promise(function(resolve,reject){
        let sessionId;
        // Let's see if we already have a session for the user fbid
        Object.keys(sessions).forEach(k => {
            if (sessions[k].fbid === fbid) {
                // Yep, got it!
                sessionId = k;
                resolve(sessionId);
            }
        });
        if (!sessionId) {
            // No session found for user fbid, let's create a new one
            sessionId = new Date().toISOString();

            Users.findOne({'facebook.id': fbid}, function (err, res) {
                if (!res) {
                    let u = new Users({'facebook.id':fbid});
                    u.save(function (err, data) {
                        sessions[sessionId] = {fbid: fbid, context: {}, logged: false,muser_id:u._id};
                        if (data) resolve(sessionId);
                        else reject(err);
                    });
                }
                else if (res) {
                    sessions[sessionId] = {fbid: fbid, context: {}, logged: false,muser_id:res._id};
                    resolve(sessionId);
                }
                else if (err) {
                    reject(err);
                }
            })
        }
    });
};

// WIT.AI actions
const actions = {
    send(request, response) {

        const {sessionId, context, entities} = request;
        const {text, quickreplies} = response;
        const recipientId = sessions[sessionId].fbid;

        return new Promise(function (resolve, reject) {
            console.log(" sending :" + JSON.stringify(request));
            if (recipientId) {
                messenger.sendTextMessage(recipientId, text, function (err, body) {
                    if (err) return console.error(err);
                    console.log(body)
                });
            }
            resolve();
        });
    },
    merge(request) {
        console.log("res in merge : " + JSON.stringify(request));
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
        console.log('saveReminder Fired');
        let rem = [];
        rem.title = firstEntityValue(entities, 'reminder');
        const datetime = firstEntityValue(entities, 'datetime');
        // let date_diff = (datetime) ? moment(datetime).diff(new Date()) : 0;
        if(datetime)  rem.date=datetime;
        return new Promise(function (resolve, reject) {
            if (rem.title) {
                rem.user_id=sessions[sessionId].muser_id;
                Reminder.create(rem).then(function(res){
                    // context.reminder_result = "Reminder Saved !";
                    console.log(reminderCreatedReply1);
                    // send quick reply, depends weather date is provided or not
                    // datetime ? messenger.sendQuickRepliesMessage(sessions[sessionId].fbid,rem + " ..saved !",reminderCreatedReply2) :
                   messenger.sendQuickRepliesMessage(sessions[sessionId].fbid,rem.title + " ..saved !",reminderCreatedReply1,function(err,data){
                       console.log(data);
                       console.log(err);
                   });
                    resolve(context);
                },function(err){
                    console.log("error in saving reminder ",err);
                    resolve(context);
                });
                context.done = true;
            }
            else resolve(context);
            console.log('Save reminder context :' + JSON.stringify(context))
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

app.post('/webhook', function (req, res) {
    var data = req.body;

    // Make sure this is a page subscription
    if (data.object == 'page') {
        // Iterate over each entry
        // There may be multiple if batched
        data.entry.forEach(function(pageEntry) {
            var pageID = pageEntry.id;
            var timeOfEvent = pageEntry.time;

            // Iterate over each messaging event
            pageEntry.messaging.forEach(function(messagingEvent) {
                if(messagingEvent.message){
                    receivedMessage(messagingEvent);
                }

                else if(messagingEvent.postback){
                    receivedPostback(messagingEvent);
                }
            });
        });
        res.sendStatus(200);
    }
});

/*
 * Message Event
 *
 * This event is called when a message is sent to your page. The 'message'
 * object format can vary depending on the kind of message that was received.
 * Read more at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-received
*/

function receivedMessage(event)
{
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;

    // You may get a text or attachment but not both
    var messageText = message.text;
    var messageAttachments = message.attachments;
    var quickReply = message.quick_reply;

    if(messageText){
        findOrCreateSession(senderID).then(function(sessionId){
            runWitAction(sessionId,text);
        });
    }
    else if(quickReply) {
        console.log("Quick Reply recived ", quickReply);
    }
    else if(messageAttachments){
        messenger.sendTextMessage(senderID,"Sorry, I can only process text messages for now.");
    }
}

/*
 * Postback Event
 *
 * This event is called when a postback is tapped on a Structured Message.
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/postback-received
 *
 */
function receivedPostback(event) {
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
function runWitAction(sessionId, msg) {
    wit.runActions(
        sessionId, // the user's current session
        msg, // the user's message
        sessions[sessionId].context // the user's current session state
    ).then((context) => {
        console.log('Wit Bot haS completed its action');
        if (context['done']) {
            console.log("clearing session data" + JSON.stringify(sessions));
            delete sessions[sessionId];
        }
        else {
            console.log("updating session data");
            // Updating the user's current session state
            sessions[sessionId].context = context;
        }
    }).catch((err) => {
        console.error('Oops! Got an error from Wit: ', err.stack || err);
    });
}

module.exports = router;