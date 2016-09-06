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
  if (process.argv.length !== 3) {
    console.log('usage: node examples/basic.js <wit-access-token>');
    process.exit(1);
  }
  return process.argv[2];
})();

const actions = {
  send(request, response) {
    const {sessionId, context, entities} = request;
    const {text, quickreplies} = response;
    return new Promise(function(resolve, reject) {
      console.log('user said...', request.text);
      console.log('sending...', JSON.stringify(response));
      return resolve();
    });
  },
  saveReminder({sessionId, context, text, entities}) {
      console.log('saveRemidner action fired');
      return new Promise(function(resolve,reject){
        resolve(context);
      });
  }
};

const client = new Wit({accessToken, actions});
interactive(client);
