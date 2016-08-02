'use strict';
const Wit=require('node-wit').Wit;
const redis=require("./../redisDB");
const ReminderModel=require('./../model/ReminderModel').Reminder;
const Session=require('./../session');

const client=redis.client;

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
     console.log("entities" + JSON.stringify(entities));
    
    return new Promise(function(resolve, reject) {
      console.log('sending...', JSON.stringify(request));
      return resolve();
    });
  },
  merge(request){
    console.log("res in merge : "+ JSON.stringify(request));
  },
  showReminder({sessionId, context, text, entities}) {
    const intent = firstEntityValue(entities, 'intent');

    return new Promise(function(resolve, reject) {
      if(intent=='show-reminder')
      {
          console.log("-----This is reminder list ");
          context.done=true;
      }
      return resolve(context);
    });
  },
  saveReminder({context, entities}) {
      var data=[];
    const reminder = firstEntityValue(entities, 'reminder');
    const datetime =   firstEntityValue(entities, 'datetime');
    let date_diff= (datetime) ? moment(datetime).diff(new Date()) : 0;
    return new Promise(function(resolve, reject) {
      if(reminder)
      {
          data['title']=reminder;
          data['datetime']=datetime;
          data['score']=date_diff;

          ReminderModel.create('3001',data,function(res){
              consle.log("response from model saveReminder: " + res);
          });
          console.log("------Reminder Saved");
          context.done=true;
      }
      console.log('Save reminder context :' + JSON.stringify(context))
      return resolve(context);
    });
  },

};

module.exports={
    init: function(){
      return new Wit({accessToken, actions})
    }
}