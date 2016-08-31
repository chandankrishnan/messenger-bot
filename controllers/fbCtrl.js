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
                    context.reminder_result = "Reminder Saved !";
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

router.post('/webhook', (req, res) => {
    console.log("reached webhook");
const data = req.body;

if (data.object === 'page') {
    data.entry.forEach(entry => {
        entry.messaging.forEach(event => {
            if (event.message) {
                const sender = event.sender.id;  //get sender id
                // const sessionId = findOrCreateSession(sender);  //get user current session
                const {text, attachments} = event.message;
                if(text)
                {
                    // create session and user if does not exist
                    findOrCreateSession(sender).then(function(sessionId){
                            runWitAction(sessionId,text);
                    });
                }
                else if(attachments)
                {

                }
            } else {
                console.log('received event', JSON.stringify(event));
            }
        });
    });
}
res.sendStatus(200);
});


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