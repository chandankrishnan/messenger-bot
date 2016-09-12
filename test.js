'use strict';
// var session         =     require('express-session');
// var redisStore      =     require('connect-redis')(session);
// var session         =     require('express-session');
// var cookieParser    =     require('cookie-parser');
// var redis           =     require("redis");

// app.use(session({
//     secret: 'ssshhhhh',
//     store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl :  260}),
//     saveUninitialized: false,
//     resave: false
// }));
// app.use(cookieParser("secretSign#143_!223"));

'use strict';

let Wit = null;
let interactive = null;
try {
  // if running from repo
  Wit = require('../').Wit;
  interactive = require('../').interactive;
} catch (e) {
  Wit = require('node-wit').Wit;
  interactive = require('node-wit').interactive;
}

const accessToken = (() => {
  // if (process.argv.length !== 3) {
  //   console.log('usage: node examples/basic.js <wit-access-token>');
  //   process.exit(1);
  // }
  return '66UZJUQ5DH4R2RO3GU6HMSM7BBHBZC75';
})();


const firstEntityValue = function (entities, entity) {
  const val = entities && entities[entity]
      && Array.isArray(entities[entity])
      && entities[entity].length > 0 &&
      entities[entity][0].value;
  if (val) return val;
  else return false;

};

const actions = {
  send(request, response) {
    const {sessionId, context, entities} = request;
    const {text, quickreplies} = response;
    const reminder= firstEntityValue(entities, 'reminder');
    const datetime = firstEntityValue(entities, 'datetime');

    if(reminder && !context.reminder) context.reminder=reminder;
    if(datetime && !context.date) context.date=date;
    return new Promise(function(resolve, reject) {
      console.log('user said...', request);
      console.log('sending...', JSON.stringify(response));
      return resolve();
    });
  },
  saveReminder({sessionId, context, text, entities}) {
      console.log('saveReminder Fired',context);
    // console.log('Entities ',entities);
    let rem = [];
    const reminder= firstEntityValue(entities, 'reminder');
    const datetime = firstEntityValue(entities, 'datetime');

      return new Promise(function(resolve,reject) {

        if(context.reminder) {
          console.log("saving reminder " ,rem);
          context.done=true;
          resolve(context);
        }
        else resolve(context);
      });
  }
};

const client = new Wit({accessToken, actions});
interactive(client);
