'use strict';

const reminder = require('./model/ReminderModel').Reminder;
const moment =require("moment");
const WitCtrl=require('./controllers/witCtrl');
const session=require('./session');

const wit=WitCtrl.init();

// wit.interactive();
// var data=[];
//           data['title']="this is reminder";
//           data['datetime']='3434';
//           data['score']='4';

//           reminder.create('3001',data,function(res){
//               console.log("response from model saveReminder: " + res);
//           });
var d=["sessionId","context"];
var c=session.get("3001",d).then(function(res){
        console.log(res[0]);
});
// session.findOrCreate('2001')

