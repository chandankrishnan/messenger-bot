'use strict';
const Wit=require('node-wit').Wit;
const redis=require("./../redisDB");
const ReminderModel=require('./../model/ReminderModel').Reminder;
const Session=require('./../session');
const Func=require('./../class/func');
const FBMessenger = require('fb-messenger');
const moment=require('moment');

const client=redis.client;

const FB_PAGE_ID=process.env.FB_PAGE_ID || '1620191058306200',
    FB_PAGE_TOKEN=process.env.FB_PAGE_TOKEN;
    
const messenger = new FBMessenger(FB_PAGE_TOKEN);

const accessToken = (() => {
  return process.env.WIT_TOKEN || 'OZLBH427SKNI7RC6Y6SUWBLDLHVCMUGG';
})();
const weather_dict=['weather','climate','temp','temperature','atmosphere'];

var firstEntityValue=function(entities,entity){
  const val = entities && entities[entity]
      && Array.isArray(entities[entity])
      && entities[entity].length > 0 &&
      entities[entity][0].value;
  if(val) return val;
  else return false;

}

const actions = {
  send(request, response) {
     
    const {sessionId, context, entities} = request;
    const {text, quickreplies} = response;
    context.sessionID=sessionId;
     console.log("entities" + JSON.stringify(request));
    
    return new Promise(function(resolve, reject) {
      console.log(" sending :" + JSON.stringify(request));
      messenger.sendTextMessage(sessionId, text);
       resolve();
    });
  },
  merge(request){
    console.log("res in merge : "+ JSON.stringify(request));
  },
  showReminder({sessionId, context, text, entities}) {
    console.log("showReminder fired");
    const intent = firstEntityValue(entities, 'intent');

    return new Promise(function(resolve, reject) {
      if(intent=='show-reminder')
      {
          console.log("-----This is reminder list ");
          context.done=true;
      }
      resolve(context);
    });
  },
  saveReminder({sessionId, context, text, entities}) {
    console.log('saveReminder Fired');
    let data=[];
    const reminder = firstEntityValue(entities, 'reminder');
    const datetime =   firstEntityValue(entities, 'datetime');
    let date_diff= (datetime) ? moment(datetime).diff(new Date()) : 0;
    return new Promise(function(resolve, reject) {
      if(reminder)
      {
          data={title:reminder,datetime:datetime,score:date_diff};
        
          ReminderModel.create(sessionId,data,function(err,res){
              console.log("response from model saveReminder: " + res);
          });
          context.reminder_result="Reminder saved."
          context.done=true;
          console.log('save first context');
          resolve(context);
      }
      else resolve(context);
      console.log('Save reminder context :' + JSON.stringify(context))
    });
  },
  getForecast({sessionId, context, text, entities}){
    console.log('getForecast Fired');
    console.log("entities " + JSON.stringify(entities));
    const intent = firstEntityValue(entities, 'intent');
    const location = firstEntityValue(entities, 'location');    
    return new Promise(function(resolve,reject){
        if(!location) context.missingLocation=true;
        if(intent=='weather' && location)
        {
          Func.weather(location,function(forecast){
            console.log("weather data " + forecast)
            context.weather_result=forecast;
            context.missingLocation=true;
            context.done=true;
            console.log("first context");
            resolve(context);
          });
        }
        console.log("second context");
        resolve(context);
    });
  }

};

module.exports={
    init: function(){
      return new Wit({accessToken, actions})
    }
}


  // Session.get(sender,['context','sessionId']).then(function(sessionData){
  //       console.log('Session Data:' + JSON.stringify(sessionData));
  //       wit.runActions(
  //         sessionData[1], // the user's current session
  //         msg, // the user's message
  //         JSON.parse(sessionData[0]), // the user's current session state (context)
  //         (error, context) => {
  //           if (error) {
  //             console.error('Oops! Got an error from Wit:', error);
  //           } else {
  //             // Our bot did everything it has to do.
  //             // Now it's waiting for further messages to proceed.
  //             console.log('Waiting for futher messages.');

  //             // Based on the session state, you might want to reset the session.
  //             // This depends heavily on the business logic of your bot.
  //             // Example:
  //             if (context['done']) {
  //               console.log("clearing session data");
  //               Session().del(sender);
  //             }
  //             console.log("updating session data");
  //             // Updating the user's current session state
  //             Session().update(sender,{'context':context});
  //           }
  //         }
  //       );
  //     });