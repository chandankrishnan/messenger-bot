'use strict';

const reminder = require('./model/ReminderModel').Reminder;
const moment =require("moment");
const WitCtrl=require('./controllers/witCtrl');
const session=require('./session');

const wit=WitCtrl.init();

wit.interactive();


