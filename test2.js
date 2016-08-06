'use strict';

// const reminder = require('./model/ReminderModel').Reminder;
// const moment =require("moment");
const WitCtrl=require('./controllers/wit');
// const session=require('./session');

// const wit=WitCtrl.init();

// wit.interactive();

var a=WitCtrl.Wit("wqdwqdqw",function(ent){
    console.log(ent.intent[0].value);
});



