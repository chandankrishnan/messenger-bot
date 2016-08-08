'use strict';

// const reminder = require('./model/ReminderModel').Reminder;
// const moment =require("moment");
const WitCtrl=require('./controllers/witCtrl');
const wit = WitCtrl.init();

wit.interactive();


