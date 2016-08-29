'use strict';

const reminder = require('./model/ReminderModel').Reminder;
// const moment =require("moment");
// const WitCtrl=require('./controllers/witCtrl');
// const wit = WitCtrl.init();
const Session = require('./session');
// wit.interactive();


// Session.findOrCreate('200',['sessionId','context']).then(function(res){
// console.log("res " + res);
// });


reminder.getUncompleted('200')




// console.log(a.length);