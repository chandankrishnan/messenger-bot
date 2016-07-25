'use strict';

// Quickstart example
// See https://wit.ai/l5t/Quickstart

// When not cloning the `node-wit` repo, replace the `require` like so:
// const Wit = require('node-wit').Wit;
const Wit = require('node-wit').Wit;

const token = (() => {
  if (process.argv.length !== 3) {
    console.log('usage: node examples/quickstart.js <wit-token>');
    process.exit(1);
  }
  return 'OZLBH427SKNI7RC6Y6SUWBLDLHVCMUGG';
})();

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value
  ;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};

const actions = {
  say(sessionId, context, message, cb) {
       console.log('say contexts ' + JSON.stringify(context));
    console.log(message);
    cb();
  },
  merge(sessionId, context, entities, message, cb) {
    // Retrieve the location entity and store it into a context field
    console.log('merge contexts ' + JSON.stringify(entities));
    const reminder = firstEntityValue(entities, 'reminder');
    const datetime = firstEntityValue(entities, 'datetime');

    if (reminder) {
      context.reminder = reminder;
    }
    if(datetime) context.datetime=datetime;

    cb(context);
  },
  error(sessionId, context, error) {
    console.log(error.message);
  },
  ['save-reminder'](sessionId, context, cb) {
    // Here should go the api call, e.g.:
    // context.forecast = apiCall(context.loc)
    console.log("context in save-rmeminder: " + JSON.stringify(context));
    console.log("saving reminders");
    
    cb(context);
  },
};

const client = new Wit(token, actions);
client.interactive();
