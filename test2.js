'use strict';

const reminder = require('./model/ReminderModel').Reminder;
// const moment =require("moment");
// const WitCtrl=require('./controllers/witCtrl');
// const wit = WitCtrl.init();
const Session = require('./session');
// wit.interactive();


const createQuickReply = function (quickreply) {
    let result = [];
    quickreply.forEach(function (value, index) {

        let temp = {"content_type": "text"};
        result.push(temp);
    });
    return result;
}
// date =2016-09-13T18:00:00.000-07:00
let rem=[];
rem.a="10";
rem.c="dewd";

console.log(rem);


// console.log(a.length);